import {useEffect, useCallback} from 'react';
import useStateRef from 'react-usestateref';

interface FetcherResponse<Data> {
  data: Data | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface QueryParams {
  [key: string]: string | number;
}

async function fetchData<Data>(
  api: string,
  query: Record<string, string | number> = {},
  signal?: AbortSignal
): Promise<Data> {
  let url;
  const queryString = Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
    .join('&');

  if (queryString) {
    url = `${api}?${queryString}`;
  } else {
    url = `${api}`;
  }

  try {
    const response = await fetch(url, {signal});
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
}

function useAPIResponse<Data>(
  key: string,
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
      fetchData<Data>(key, queryParams || {}, controller.signal)
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
      fetchData<Data>(key, queryParams || {})
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
