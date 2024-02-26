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
    const worker = getWorkerInstance();
    const currentRequestId = Date.now().toString();
    requestIdRef.current = currentRequestId;

    setIsLoading(true);

    worker.postMessage({key, requestId: currentRequestId, query: queryParamsRef.current});

    const handleMessage = (event: MessageEvent) => {
      const {data: newData, error: workerError, requestId} = event.data;

      // eslint-disable-next-line no-console
      console.log(
        'handleMessage',
        newData,
        workerError,
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
      worker.postMessage({key, requestId: currentRequestId, action: 'cancel'});
    };
  }, [key, JSON.stringify(queryParams)]); // Dependency on both key and queryParams

  useEffect(() => {
    queryParamsRef.current = queryParams; // Update queryParamsRef on queryParams change
    return fetchData(); // Call fetchData and return the cleanup function
  }, [fetchData]);

  return {data, isLoading, error};
}

export default useStaleWhileRevalidateWithWorker;
