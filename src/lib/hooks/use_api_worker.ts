// Info: 搭配 Web worker 寫出多線程管理 API 的調用，包含發起 request 跟取消 request 的功能 (20240227 - Shirley)
import {useEffect, useRef, useCallback} from 'react';
import useStateRef from 'react-usestateref';
import {FetcherResponse, QueryParams, RequestOptions} from '@/constants/api_request';

/**Info: A custom hook to manage API calls (20240313 - Shirley)
 *
 * @param {string} key - The API endpoint.
 * @param {RequestOptions} options - The options for the API request.
 * @param {QueryParams} [queryParams] - The query parameters for the API request.
 * @param {boolean} [cancel] - A flag to indicate whether the API request should be cancellable when it's duplicate.
 *
 * @returns {FetcherResponse<Data>} - The response from the API call.
 */
function useAPIWorker<Data>(
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
  const requestIdRef = useRef<string>(Date.now().toString());
  const queryParamsRef = useRef<QueryParams | undefined>(queryParams);

  const fetchData = useCallback(() => {
    // useEffect(() => {
    const worker = new Worker(new URL('../utils/data_fetcher_worker', import.meta.url), {
      type: 'module',
    });
    // const worker = getWorkerInstance();
    const keyId = `${key}`;
    // const currentRequestId = Date.now().toString();
    requestIdRef.current = `${keyId}`;

    setIsLoading(true);

    worker.postMessage({
      key,
      options,
      requestId: requestIdRef.current,
      query: queryParamsRef.current,
    });

    const handleMessage = (event: MessageEvent) => {
      const {data: newData, error: workerError, requestId} = event.data;

      if (requestId !== requestIdRef.current) return;
      if (workerError) {
        setError(new Error(workerError));
      } else {
        setData(newData);
        setError(null);
      }
      setIsLoading(false);
    };

    worker.addEventListener('message', handleMessage);
    worker.onerror = (e: ErrorEvent) => {
      setError(new Error(e.message));
      setIsLoading(false);
    };

    return () => {
      worker.removeEventListener('message', handleMessage);
      if (cancel)
        worker.postMessage({key, options, requestId: requestIdRef.current, action: 'cancel'});
      // Info: Close worker in worker after receiving cancel message for 1 sec (20240227 - Shirley)
      // worker.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(queryParams)]); // Dependency on both key and queryParams

  useEffect(() => {
    queryParamsRef.current = queryParams; // Info: Update queryParamsRef on queryParams change (20240227 - Shirley)
    return fetchData(); // Info: Call fetchData and return the cleanup function (20240227 - Shirley)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData]);

  return {data: dataRef.current, isLoading: isLoadingRef.current, error: errorRef.current};
}

export default useAPIWorker;
