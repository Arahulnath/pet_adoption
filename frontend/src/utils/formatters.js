export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatAge(age) {
  if (age === undefined || age === null || age === "") return "Age unknown";
  const n = Number(age);
  if (Number.isNaN(n)) return "Age unknown";
  if (n < 1) return "Under 1 year";
  return `${n} ${n === 1 ? "year" : "years"} old`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  const base = process.env.REACT_APP_IMAGE_BASE_URL || "";
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`;
}
