import { useEffect, useRef } from 'react';

/**
 * Hook for API calls with automatic request cancellation on unmount
 * Prevents memory leaks and setState on unmounted components
 * 
 * Usage:
 * const { fetchWithCancel } = useApi();
 * 
 * useEffect(() => {
 *   fetchWithCancel(async (signal) => {
 *     const data = await api.getProducts({ signal });
 *     setData(data);
 *   });
 * }, []);
 */
export const useApi = () => {
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Create new AbortController on mount
    abortControllerRef.current = new AbortController();
    isMountedRef.current = true;

    // Cleanup: abort any pending requests on unmount
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Wrap your async fetch function with this
   * @param {Function} fetchFn - Async function that takes signal as parameter
   * @returns {Promise} Result of the fetch function
   */
  const fetchWithCancel = async (fetchFn) => {
    if (!isMountedRef.current) {
      console.warn('Attempted to fetch on unmounted component');
      return;
    }

    try {
      const signal = abortControllerRef.current?.signal;
      return await fetchFn(signal);
    } catch (error) {
      // Ignore abort errors (component unmounted)
      if (error.name === 'AbortError') {
        console.log('Request cancelled (component unmounted)');
        return;
      }
      // Re-throw other errors
      throw error;
    }
  };

  /**
   * Check if component is still mounted
   * Useful for conditional state updates
   */
  const isMounted = () => isMountedRef.current;

  /**
   * Manually abort current request
   */
  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      // Create new controller for future requests
      abortControllerRef.current = new AbortController();
    }
  };

  return {
    fetchWithCancel,
    isMounted,
    abort,
    signal: abortControllerRef.current?.signal,
  };
};

export default useApi;
