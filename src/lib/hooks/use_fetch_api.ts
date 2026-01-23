import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/services/api_service';

/**
 * A custom hook to fetch data from an API endpoint.
 * @param url The API endpoint URL. If null, the fetch will not execute.
 * @param errorMessage Custom error message to show on failure.
 * @returns An object containing the data, loading state, and error message.
 */
export function useFetchApi<T>(
  url: string | null,
  errorMessage: string = '無法下載數據，請稍後再試。'
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchApi<T>(url);
        setData(result);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch from ${url}:`, err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, errorMessage]);

  return { data, loading, error };
}
