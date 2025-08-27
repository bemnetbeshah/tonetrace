import { useState, useCallback } from 'react';

export function useApiSafe<T extends (...args: any[]) => Promise<any>>(fn: T) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const call = useCallback(async (...args: Parameters<T>) => {
    setLoading(true);
    setError(null);
    try {
      return await fn(...args);
    } catch (e: any) {
      setError(e?.message || 'Request failed');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [fn]);

  return { call, loading, error };
}

