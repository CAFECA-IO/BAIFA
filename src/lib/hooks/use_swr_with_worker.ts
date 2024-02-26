// useStaleWhileRevalidateWithWorker.ts
import {useState, useEffect, useRef} from 'react';
import {getWorkerInstance} from '../utils/api_worker_singleton';

interface FetcherResponse<Data> {
  data: Data | undefined;
  isLoading: boolean;
  error: Error | null;
}

function useStaleWhileRevalidateWithWorker<Data>(key: string): FetcherResponse<Data> {
  const [data, setData] = useState<Data | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const requestIdRef = useRef<string>('0');

  useEffect(() => {
    const worker =
      // getWorkerInstance();
      new Worker(new URL('../utils/data_fetcher_worker', import.meta.url), {
        type: 'module',
      });
    // eslint-disable-next-line no-console
    console.log('worker', worker, 'requestIdRef', requestIdRef.current);

    setIsLoading(true);

    const currentRequestId = requestIdRef.current;
    worker.postMessage({key, requestId: currentRequestId});

    worker.onmessage = (event: MessageEvent) => {
      const {data: newData, error: workerError, requestId} = event.data;

      if (requestId !== requestIdRef.current) return; // Ignore if not the latest request
      if (workerError) {
        setError(new Error(workerError));
      } else {
        setData(newData);
        setError(null);
      }
      setIsLoading(false);
    };

    worker.onerror = (e: ErrorEvent) => {
      setError(new Error(e.message));
      setIsLoading(false);
    };

    return () => {
      worker.terminate();
    };
  }, [key]);

  return {data, isLoading, error};
}

export default useStaleWhileRevalidateWithWorker;
