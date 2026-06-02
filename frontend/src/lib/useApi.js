import { useEffect, useState } from "react";
import fetchModelData from "./fetchModelData";

export default function useApi(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(!!url);
  const [error, setError] = useState(false);
  const serializedDeps = JSON.stringify(deps);

  useEffect(() => {
    if (!url) {
      setData(null);
      setLoading(false);
      setError(false);
      return;
    }

    let ok = true;
    setLoading(true);
    setError(false);

    (async () => {
      try {
        const d = await fetchModelData(url);
        if (ok) setData(d);
      } catch {
        if (ok) setError(true);
      } finally {
        if (ok) setLoading(false);
      }
    })();

    return () => {
      ok = false;
    };
  }, [url, serializedDeps]);

  return { data, loading, error, setData };
}