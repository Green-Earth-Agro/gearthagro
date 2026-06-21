import { useCallback, useEffect, useRef, useState } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Minimal async-query hook for the admin: runs `fn` on mount and whenever `key`
// changes, and exposes a manual `refetch`. Enough for RPC-backed reads without
// pulling in a data-fetching library. Stale results from a superseded key are dropped.
export function useQuery<T>(key: string, fn: () => Promise<T>) {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useRef(async (activeKey: string) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      if (latestKey.current === activeKey) setState({ data, loading: false, error: null });
    } catch (e) {
      if (latestKey.current === activeKey) {
        setState({ data: null, loading: false, error: e instanceof Error ? e.message : 'Something went wrong' });
      }
    }
  });
  const latestKey = useRef(key);

  useEffect(() => {
    latestKey.current = key;
    void run.current(key);
  }, [key]);

  // Update the cached data in place without a refetch or a loading flash — for
  // silent mutations where the new value is already known.
  const setData = useCallback((updater: (prev: T | null) => T | null) => {
    setState((s) => ({ ...s, data: updater(s.data) }));
  }, []);

  return {
    ...state,
    refetch: () => run.current(latestKey.current),
    setData,
  };
}
