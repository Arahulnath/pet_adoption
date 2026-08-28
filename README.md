# 🐾 Pet Adoption Management System

A full-featured REST API backend for managing pet adoptions, built with Spring Boot 3, MySQL, Spring Security, and JWT authentication.

---

## 🛠 Tech Stack

- **Java 21**
- **Spring Boot 3.2.5**
- **Spring Security + JWT**
- **Spring Data JPA + Hibernate**
- **MySQL**
- **JavaMail (SMTP)**
- **Springdoc OpenAPI (Swagger UI)**
- **Lombok**
- **Maven**

---

## 📋 Prerequisites

Make sure you have the following installed:

- [Java 21](https://adoptium.net/)
- [Maven](https://maven.apache.org/download.cgi)
- [MySQL](https://dev.mysql.com/downloads/)

---

## ⚙️ Setup & Configuration

### 1. Clone the project

```bash
git clone <your-repo-url>
cd PetadoptionSRS/springapp
```

### 2. Configure `application.properties`

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/pet_adoption_db?createDatabaseIfNotExist=true
spring.datasource.username=your_mysql_username
spring.datasource.password=your_mysql_password

# Email (Gmail example)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# Donation Gateway
donation.gateway-url=https://your-payment-gateway.com/donate
```

### 3. Build the project

```bash
mvn clean install
```

### 4. Run the project

```bash
mvn spring-boot:run
```

The server starts at **`http://localhost:8080`**

---

## 📖 API Documentation (Swagger UI)

Once the app is running, open:

```
http://localhost:8080/swagger-ui.html
```

---

## 🔐 Authentication

### Register Staff
```
POST /api/auth/staff/register
```
```json
{
  "username": "admin",
  "password": "Admin@1234",
  "role": "MANAGER"
}
```

### Login Staff
```
POST /api/auth/staff/login
```
```json
{
  "username": "admin",
  "password": "Admin@1234"
}
```
Returns a JWT token:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "MANAGER"
}
```

### Register User (Public)
```
POST /api/auth/user/register
```
```json
{
  "email": "user@example.com",
  "password": "User@1234"
}
```

### Login User
```
POST /api/auth/user/login
```
```json
{
  "email": "user@example.com",
  "password": "User@1234"
}
```

---

## 🐶 API Endpoints

### Pets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pets` | Get all pets |
| GET | `/api/pets/{id}` | Get pet by ID |
| GET | `/api/pets/status/{status}` | Filter pets by status |
| GET | `/api/pets/search?keyword=` | Search pets by name/species |
| POST | `/api/pets` | Add new pet (Staff) |
| PUT | `/api/pets/{id}` | Update pet (Staff) |
| DELETE | `/api/pets/{id}` | Delete pet (Staff) |

### Pet Images
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pets/{petId}/images` | Get all images for a pet |
| POST | `/api/pets/{petId}/images` | Add image to pet (Staff) |
| PUT | `/api/pets/{petId}/images/{imageId}/primary` | Set primary image (Staff) |
| DELETE | `/api/pets/{petId}/images/{imageId}` | Delete image (Staff) |

### Adoption Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/adoption-requests/pet/{petId}` | Submit adoption request |
| GET | `/api/adoption-requests` | Get all requests (Staff) |
| GET | `/api/adoption-requests/{id}` | Get request by ID (Staff) |
| PUT | `/api/adoption-requests/{id}/status` | Update request status (Staff) |
| DELETE | `/api/adoption-requests/{id}` | Delete request (Staff) |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/staff/register` | Register staff |
| POST | `/api/auth/staff/login` | Staff login |
| POST | `/api/auth/user/register` | Register public user |
| POST | `/api/auth/user/login` | User login |

### Shelter Info
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shelter` | Get shelter info (Public) |
| PUT | `/api/shelter` | Update shelter info (Staff) |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/dashboard?months=1` | Get dashboard metrics (Staff) |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get user favorites |
| POST | `/api/favorites/{petId}` | Add pet to favorites |
| DELETE | `/api/favorites/{petId}` | Remove pet from favorites |

### Donation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donation/redirect` | Get payment gateway URL |
| POST | `/api/donation/confirm` | Send donation confirmation email |

---

## 📦 Adoption Request Status Flow

```
Submit Request → PENDING
Staff Updates  → RECEIVED → UNDER_REVIEW → APPROVED / REJECTED

APPROVED  → Pet status becomes ADOPTED
REJECTED  → Pet status reverts to AVAILABLE (if no other pending requests)
```

---

## 🗄️ Database Schema (Entities)

| Table | Description |
|-------|-------------|
| `pets` | Pet listings with health info and status |
| `pet_images` | Multiple images per pet |
| `adoption_requests` | Adoption applications |
| `staff` | Staff accounts with roles |
| `users` | Registered public users |
| `favorite_pets` | User pet wishlist (junction table) |
| `shelter_info` | Shelter public information |

---

## 👥 Roles

| Role | Access |
|------|--------|
| Guest | View pets, shelter info, submit adoption request |
| USER | Guest + favorites |
| ADMIN | USER + manage pets, requests, shelter, analytics |
| MANAGER | ADMIN + delete pets |

---

## 📁 Project Structure

```
springapp/
├── src/main/java/com/petadoption/
│   ├── config/          # Security, JWT, CORS, Swagger
│   ├── controller/      # REST controllers
│   ├── exception/       # Global exception handler
│   ├── model/           # JPA entities
│   ├── repository/      # Spring Data repositories
│   └── service/         # Business logic
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

---

## 📧 Email Notifications

The system sends emails automatically for:
- ✅ Adoption request submitted (confirmation to applicant)
- ✅ Adoption request status updated (to applicant)
- ✅ Donation completed (to donor)

Configure your SMTP credentials in `application.properties` to enable this.

---

## 🚀 Build for Production

```bash
mvn clean package
java -jar target/pet-adoption-0.0.1-SNAPSHOT.jar
```
