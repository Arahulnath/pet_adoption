# Pawfinder — Pet Adoption Management System (Frontend)

A production-style React frontend for the **Pet Adoption Management System**, built for the Review 2
evaluation. Plain **Create React App** (no Vite), React Router, Axios, Context API, and custom hooks.

This app was built directly from the project's SRS document (data model, functional requirements
FR1–FR15, and the Role-Based Access Control matrix), extracted from the screen recording provided.

---

## 1. Getting started

```bash
npm install
cp .env.example .env      # then edit REACT_APP_API_BASE_URL to point at your backend
npm start                 # http://localhost:3000
npm run build              # production build -> /build
```

## 2. Connecting your real backend

**Every** network call lives in `src/api/*.js` — nowhere else. To point this frontend at your actual
backend, you only need to:

1. Set `REACT_APP_API_BASE_URL` in `.env` (e.g. `http://localhost:8080/api`).
2. If your route names differ from the assumed ones below, edit the matching file in `src/api/`.
   Every component calls these functions — never axios directly — so a route rename is a one-line change.

### Assumed REST contract

The SRS describes entities and relationships (Section 5, Data Model) but not literal HTTP paths, since
no live backend was available to inspect. The frontend assumes conventional REST endpoints; adjust to match:

| Resource | Method & Path | Notes |
|---|---|---|
| Register | `POST /auth/register` | FR4 |
| User login | `POST /auth/login` | |
| Staff login | `POST /auth/staff/login` | FR7 |
| Current profile | `GET /auth/me` | |
| List pets | `GET /pets?search=&species=&ageGroup=&status=&page=&limit=` | FR1, FR2 |
| Pet detail | `GET /pets/:id` | FR3 |
| Create pet | `POST /pets` (staff) | FR8 |
| Update pet | `PUT /pets/:id` (staff) | FR8 |
| Delete pet | `DELETE /pets/:id` (staff) | FR8 |
| Submit request | `POST /adoption-requests` | FR6 |
| My requests | `GET /adoption-requests/mine` | registered user |
| List requests | `GET /adoption-requests?status=&page=&limit=` (staff) | FR9 |
| Update request status | `PATCH /adoption-requests/:id/status` (staff) | FR9, FR10 |
| Favorites | `GET/POST/DELETE /users/me/favorites[/:petId]` | FR5 |
| Shelter info | `GET /shelter`, `PUT /shelter` (staff) | FR12 |
| Dashboard stats | `GET /staff/dashboard/stats` | FR14 |

All requests carry `Authorization: Bearer <token>` automatically once logged in
(`src/api/axiosClient.js`). 401/403/404/409/422/500 responses are normalized into a single
`{ status, message, fieldErrors }` shape so every page can show a readable error instead of
`AxiosError 409`.

---

## 3. Project structure

```
src/
├── api/            # One file per resource — the ONLY place axios is called
├── components/
│   ├── common/     # Button, Input/Select/Textarea, Modal, Badge, Toast, Pagination, ...
│   ├── layout/      # PublicNavbar, Sidebar, StaffLayout, PublicLayout, Footer
│   ├── forms/       # PetForm (create+edit), AdoptionRequestForm
│   ├── tables/      # DataTable — generic, column-config driven
│   ├── cards/       # PetCard
│   └── routes/      # ProtectedRoute (role-aware route guard)
├── context/         # AuthContext, ToastContext
├── hooks/           # useAuth, useToast, useFetch, useDebounce, useForm
├── pages/
│   ├── Public/      # Home, PetCatalog, PetDetail, Shelter, Donate, NotFound
│   ├── Auth/        # Login, Register, StaffLogin
│   ├── User/        # Favorites, MyRequests (registered user only)
│   └── Staff/        # Dashboard, PetsList, RequestsList, ShelterSettings
├── constants/       # Status enums, shared lists (single source of truth)
├── utils/           # validators.js, formatters.js
└── styles/          # tokens.css (design system), base.css
```

## 4. Routes

```
/                      Home
/pets                  Public pet catalog (search, filter, pagination)
/pets/:id              Pet profile + submit adoption request
/shelter                Public shelter info
/donate                 Donation page
/login /register        Registered-user auth
/favorites               Registered-user only (protected)
/my-requests             Registered-user only (protected)
/staff/login             Staff auth
/staff/dashboard          Staff only (protected)
/staff/pets                Staff pet CRUD (protected)
/staff/requests            Staff request management (protected)
/staff/shelter              Staff shelter-info editor (protected)
*                        404
```

## 5. Role-based access

Matches the SRS RBAC matrix (Guest / Registered User / Staff). A single `AuthContext` stores one
identity with a `role` field; `ProtectedRoute` redirects to the right login page and blocks
cross-role access (e.g. a logged-in user can't open `/staff/*`).

---

# Review 2 Technical Explanation

## Architecture

```
User → React UI → Components → Hooks/Context → API service layer → Axios → Backend → Database
```

Every page is a **component** built from smaller **reusable components** (`Button`, `Input`, `Modal`,
`DataTable`, `PetCard`, `Badge`...). Pages never call `axios` directly — they call a function from
`src/api/`, which is the single place that knows the backend's URL and shape.

## React concepts used

- **Components & props** — `PetCard`, `DataTable`, `PetForm` all take data in via props and report
  actions back up via callback props (`onEdit`, `onDelete`, `onSubmit`).
- **State (`useState`)** — form values, modal open/closed, search text, selected filters, pagination.
- **`useEffect`** — used inside `useFetch` to call the API on mount / when dependencies change.
- **`useContext`** — `AuthContext` (who's logged in, what role) and `ToastContext` (global
  notifications) are both consumed via context so any component can read/act on them without prop
  drilling.
- **Custom hooks** — `useAuth()`, `useToast()`, `useFetch()`, `useDebounce()`, `useForm()`. Each wraps
  a piece of repeated logic (auth state, data fetching lifecycle, debounced search, form
  validation/submission) so pages stay declarative.
- **Conditional rendering & lists** — loading/error/empty states everywhere; `.map()` with `key` for
  pet cards, table rows, badges.
- **Reusability** — one `PetForm` powers both Create and Edit; one `DataTable` powers both the Pets
  table and the Requests table; one `Modal`/`ConfirmDialog` is reused for every dialog in the app.

## Routing

React Router's `<Routes>`/`<Route>` tree in `App.jsx` nests a `PublicLayout` (navbar + footer) and a
`StaffLayout` (sidebar). `ProtectedRoute` is a small wrapper component that checks
`useAuth()` and either renders its children or `<Navigate>`s to the right login page — this is the
whole "protected route" story in one ~20-line file.

## API integration & CRUD

`src/api/axiosClient.js` creates one configured Axios instance (base URL from `.env`, auth header
attached automatically, errors normalized). Every resource (`petApi`, `adoptionRequestApi`, ...) is a
thin object of functions calling that instance. Pages call these functions inside `useFetch` (for GET)
or directly inside form `onSubmit` handlers (for POST/PUT/PATCH/DELETE), then update state and show a
toast — the same `idle → loading → success/error` flow everywhere.

## Forms & validation

`useForm` is a small controlled-form hook: it tracks values/errors/touched, validates on blur and on
submit using a declarative `schema` (see `utils/validators.js`), and surfaces backend field errors
(400/422) next to the right input. Every form in the app (login, register, pet form, adoption request
form, shelter settings) uses the same hook.

## State management

- **Local state** — `useState` inside a page/component (e.g. which modal is open).
- **Server state** — data fetched from the API, held in component state via `useFetch`, refetched after
  mutations.
- **Global state** — `AuthContext` (who's logged in) and `ToastContext` (notifications), because both
  need to be reachable from anywhere in the tree without prop drilling.

## Why these decisions (sample viva answers)

> **Why a centralized API layer?** So components stay focused on UI, and so the base URL or a single
> endpoint can change in one file instead of hunting through every page.

> **Why `useFetch`/`useForm` as custom hooks?** They wrap the same repeated logic (loading/error state,
> validation/submission) so every page doesn't reinvent it, and so the loading → success/error pattern
> stays consistent everywhere for a good UX.

> **Why one `PetForm` for create and edit?** Less duplication and one place to fix bugs or add a field —
> the form just receives `mode` and `initialData` as props.

> **Why a single `AuthContext` for two roles?** A browser tab is only ever one identity at a time
> (guest, registered user, or staff), so one context with a `role` field is simpler to explain and
> reason about than two parallel auth systems.
