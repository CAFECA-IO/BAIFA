// useStaleWhileRevalidateWithWorker.ts
import {useState, useEffect, useRef, useCallback} from 'react';
import {getWorkerInstance} from '../utils/api_worker_singleton';

interface FetcherResponse<Data> {
  data: Data | undefined;
  isLoading: boolean;
  error: Error | null;
}

interface QueryParams {
  [key: string]: string | number;
}

function useStaleWhileRevalidateWithWorker<Data>(
  key: string,
  queryParams?: QueryParams
): FetcherResponse<Data> {
  const [data, setData] = useState<Data | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
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

    worker.postMessage({key, requestId: requestIdRef.current, query: queryParamsRef.current});

    const handleMessage = (event: MessageEvent) => {
      const {data: newData, error: workerError, requestId} = event.data;

      // eslint-disable-next-line no-console
      console.log(
        'handleMessage',
        newData,
        workerError,
        'requestId',
        requestId,
        'query',
        queryParamsRef.current
      );

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
      worker.postMessage({key, requestId: requestIdRef.current, action: 'cancel'});
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

  return {data, isLoading, error};
}

export default useStaleWhileRevalidateWithWorker;
