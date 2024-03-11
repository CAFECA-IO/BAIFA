// Info: 與 `useAPIWorker` 做比較，有時候不要另開線程會比較快，管理 API 的調用，包含發起 request 跟取消 request 的功能，但目前只有 GET (20240227 - Shirley)
import {useEffect, useCallback} from 'react';
import useStateRef from 'react-usestateref';
import {HttpMethod} from '../../constants/api_request';

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
  method: HttpMethod = HttpMethod.GET,
  body: any = null,
  query: Record<string, string | number> = {},
  signal?: AbortSignal
): Promise<Data> {
  let url;
  const queryString = Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
    .join('&');

  const options: RequestInit = {
    method,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    signal,
  };

  if (body) {
    options.body = JSON.stringify(body);
    options.headers = {
      'Content-Type': 'application/json',
    };
  }

  if (queryString) {
    url = `${api}?${queryString}`;
  } else {
    url = `${api}`;
  }

  try {
    // const response = await fetch(url, {signal});
    const response = await fetch(url, options);
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
  method: HttpMethod = HttpMethod.GET,
  body: any = null,
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
      fetchData<Data>(key, method, body, queryParams || {}, controller.signal)
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
      fetchData<Data>(key, method, body, queryParams || {})
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
