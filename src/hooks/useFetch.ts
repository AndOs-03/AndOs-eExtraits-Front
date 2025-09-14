import { useEffect, useState } from "react";
import { ApiError } from "../api/types";

export function useFetch<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fn()
    .then((res) => !cancel && setData(res))
    .catch((e) => !cancel && setError(e))
    .finally(() => !cancel && setLoading(false));
    return () => {
      cancel = true;
    };
  }, deps);

  return { data, loading, error };
}
