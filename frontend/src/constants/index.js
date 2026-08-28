// Central place for enums / fixed lists so nothing is hardcoded inline
// across components. Values mirror the conceptual data model in the SRS
// (Section 5 — Data Model (Conceptual)).

export const ADOPTION_STATUS = {
  AVAILABLE: "AVAILABLE",
  PENDING: "PENDING",
  ADOPTED: "ADOPTED",
};

export const ADOPTION_STATUS_OPTIONS = Object.values(ADOPTION_STATUS);

export const REQUEST_STATUS = {
  RECEIVED: "RECEIVED",
  UNDER_REVIEW: "UNDER_REVIEW",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const REQUEST_STATUS_OPTIONS = Object.values(REQUEST_STATUS);

export const SPECIES_OPTIONS = ["Dog", "Cat", "Bird", "Reptile", "Rabbit", "Other"];

export const AGE_GROUP_OPTIONS = [
  { label: "Puppy / Kitten", value: "young" },
  { label: "Juvenile", value: "juvenile" },
  { label: "Adult", value: "adult" },
  { label: "Senior", value: "senior" },
];

export const ROLES = {
  GUEST: "guest",
  USER: "user",
  STAFF: "staff",
};

export const STAFF_ROLES = {
  ADMIN: "Admin",
  MANAGER: "Manager",
};

// Badge tone used by the Badge component — keeps status -> color mapping
// in one place instead of scattering conditionals through pages.
export const STATUS_TONE = {
  [ADOPTION_STATUS.AVAILABLE]: "success",
  [ADOPTION_STATUS.PENDING]: "warning",
  [ADOPTION_STATUS.ADOPTED]: "adopted",
  [REQUEST_STATUS.RECEIVED]: "info",
  [REQUEST_STATUS.UNDER_REVIEW]: "warning",
  [REQUEST_STATUS.APPROVED]: "success",
  [REQUEST_STATUS.REJECTED]: "error",
  // legacy title-case fallbacks
  Available: "success",
  Pending: "warning",
  Adopted: "adopted",
  Received: "info",
  "Under Review": "warning",
  Approved: "success",
  Rejected: "error",
};

export const PAGE_SIZE = 9;
export const TABLE_PAGE_SIZE = 10;
