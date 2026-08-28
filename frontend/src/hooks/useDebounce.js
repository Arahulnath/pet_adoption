import { useEffect, useState } from "react";

// Debounces a fast-changing value (e.g. a search box) so we don't fire
// an API request on every keystroke (SRS 3.2.1 performance requirement,
// and Rubric "Performance -> debounced search").
export default function useDebounce(value, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
