import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useFetch — wraps an async fetcher function with the standard
 * idle -> loading -> success/error UI-state flow described in the SRS
 * viva notes. Used for every GET-driven list/detail page so loading,
 * error, and empty states stay consistent app-wide.
 *
 * @param {Function} fetcher - async function returning the raw data
 * @param {Array} deps - dependency array; refetches when these change
 * @param {Object} options - { skip: boolean }
 */
export default function useFetch(fetcher, deps = [], options = {}) {
  const { skip = false } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcherRef.current();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skip) return;
    let active = true;
    setLoading(true);
    setError(null);
    fetcherRef
      .current()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, setData, loading, error, refetch };
}
