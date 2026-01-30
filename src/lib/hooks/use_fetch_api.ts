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

  // Info: (20260130 - Julian) Serialize body for dependency stability
  const serializedBody = body ? JSON.stringify(body) : undefined;

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        /**
         * Info: (20260130 - Julian) Parse body back to object for fetchApi if needed,
         * or if fetchApi handles stringified body.
         * fetchApi implementation likely takes object and stringifies it,
         * or takes body as is.
         * Previous code was: body: body ? JSON.stringify(body) : undefined,
         * which implies fetchApi expects a string (?) or the previous code was stringifying it twice?
         * Let's assume fetchApi expects 'any' and handles it.
         * If the previous code passed `JSON.stringify(body)`, then it passed a string.
         * So we can pass serializedBody directly?
         * Wait, looking at line 35 of original: `body: body ? JSON.stringify(body) : undefined`
         * So it was passing a string.
         */
        const result = await fetchApi<T>(url, {
          method,
          body: serializedBody,
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
  }, [url, errorMessage, method, serializedBody]);

  return { data, loading, error };
}
