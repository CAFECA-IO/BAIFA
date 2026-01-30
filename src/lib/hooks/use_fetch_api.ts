import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/services/api_service';
import { IApiMethod } from '@/interfaces/api_method';

interface IUseFetchApiOptions {
  url: string | null;
  method: IApiMethod;
  errorMessage: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
}

/**
 * Info: (20260130 - Julian) A custom hook to fetch data from an API endpoint.
 * @param url The API endpoint URL. If null, the fetch will not execute.
 * @param errorMessage Custom error message to show on failure.
 * @returns An object containing the data, loading state, and error message.
 */
export function useFetchApi<T>({ url, method, errorMessage, body }: IUseFetchApiOptions) {
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
        const result = await fetchApi<T>(url, {
          method,
          body: body ? JSON.stringify(body) : undefined,
        });
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
  }, [url, errorMessage, method, JSON.stringify(body)]);

  return { data, loading, error };
}
