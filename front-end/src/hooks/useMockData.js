import { useCallback, useEffect, useState } from 'react';
import { fetchMockResource } from '../services/mockApi.js';

const defaultOptions = {
  initialData: null,
  transform: null
};

export function useMockData(resourceKey, options) {
  const { initialData, transform } = { ...defaultOptions, ...options };
  const [data, setData] = useState(initialData ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const payload = await fetchMockResource(resourceKey);
      const nextData = typeof transform === 'function' ? transform(payload) : payload;
      setData(nextData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown data load error'));
    } finally {
      setLoading(false);
    }
  }, [resourceKey, transform]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const payload = await fetchMockResource(resourceKey);
        if (!isMounted) {
          return;
        }
        const nextData = typeof transform === 'function' ? transform(payload) : payload;
        setData(nextData);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        setError(err instanceof Error ? err : new Error('Unknown data load error'));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [resourceKey, transform]);

  return {
    data,
    loading,
    error,
    refetch: load
  };
}
