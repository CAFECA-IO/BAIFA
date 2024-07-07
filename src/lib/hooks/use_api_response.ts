// Info: 與 `useAPIWorker` 做比較，有時候不要另開線程會比較快，管理 API 的調用，包含發起 request 跟取消 request 的功能 (20240227 - Shirley)
import {useEffect, useCallback} from 'react';
import useStateRef from 'react-usestateref';
import {
  FetcherResponse,
  HttpMethod,
  QueryParams,
  RequestOptions,
} from '@/constants/api_request';

async function fetchData<Data>(
  api: string,
  options: RequestOptions,
  query: Record<string, string | number> = {},
  signal?: AbortSignal
): Promise<Data> {
  let url;
  const queryString = Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
    .join('&');

  const fetchOptions: RequestInit = {
    method: options.method,
    signal,
  };

  if (options.method !== HttpMethod.GET && options.body) {
    fetchOptions.body = JSON.stringify(options.body);
    fetchOptions.headers = {
      'Content-Type': 'application/json',
    };
  }

  if (queryString) {
    url = `${api}?${queryString}`;
  } else {
    url = `${api}`;
  }

  try {
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
}

/**Info: A custom hook to manage API calls (20240313 - Shirley)
 *
 * @param {string} key - The API endpoint.
 * @param {RequestOptions} options - The options for the API request.
 * @param {QueryParams} [queryParams] - The query parameters for the API request.
 * @param {boolean} [cancel] - A flag to indicate whether the API request should be cancellable when it's duplicate.
 *
 * @returns {FetcherResponse<Data>} - The response from the API call.
 */
function useAPIResponse<Data>(
  key: string,
  options: RequestOptions,
  queryParams?: QueryParams,
  cancel?: boolean
): FetcherResponse<Data> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, setData, dataRef] = useStateRef<Data | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading, isLoadingRef] = useStateRef<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError, errorRef] = useStateRef<Error | null>(null);

  const fetchDataCallback = useCallback(() => {
    let cleanupFunction = () => {
      return;
    };
    if (cancel) {
      const controller = new AbortController();
      setIsLoading(true);
      fetchData<Data>(key, options, queryParams || {}, controller.signal)
        .then(responseData => {
          setData(responseData);
          setError(null);
        })
        .catch(error => {
          setError(error instanceof Error ? error : new Error('An error occurred'));
        })
        .finally(() => {
          setIsLoading(false);
        });

      cleanupFunction = () => controller.abort(); // Info: Cleanup function to abort fetch request (20240227 - Shirley)
    } else {
      setIsLoading(true);
      fetchData<Data>(key, options, queryParams || {})
        .then(responseData => {
          setData(responseData);
          setError(null);
        })
        .catch(error => {
          setError(error instanceof Error ? error : new Error('An error occurred'));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
    return cleanupFunction;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(queryParams), cancel]);

  useEffect(() => {
    return fetchDataCallback(); // Info: Execute fetchDataCallback and return the cleanup function (20240227 - Shirley)
  }, [fetchDataCallback]);

  return {data: dataRef.current, isLoading: isLoadingRef.current, error: errorRef.current};
}

export default useAPIResponse;
