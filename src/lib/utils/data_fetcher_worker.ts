// dataFetcherWorker.ts
/// <reference lib="webworker" />

async function fetchData(api: string): Promise<any> {
  // Implement the fetch logic here
  // For example, fetch data from an API based on the key
  return fetch(`${api}`).then(response => response.json());
}

self.onmessage = async (event: MessageEvent) => {
  const {key, requestId} = event.data;
  try {
    const data = await fetchData(key);
    self.postMessage({data, requestId});
  } catch (error) {
    self.postMessage({error: (error as Error).message, requestId});
  }
};
