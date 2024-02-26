/// <reference lib="webworker" />

interface FetchRequestData {
  key: string;
  requestId: string;
  action?: 'cancel';
}

let activeRequest: string | null = null;
let controller: AbortController | null = null;

async function fetchData(api: string, signal: AbortSignal): Promise<unknown> {
  // Implement the fetch logic here
  // For example, fetch data from an API based on the key
  return fetch(api, {signal}).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

self.onmessage = async (event: MessageEvent<FetchRequestData>) => {
  const {key, requestId, action} = event.data;

  if (action === 'cancel') {
    if (activeRequest === requestId) {
      controller?.abort(); // Abort the current request
      controller = null; // Reset the controller
    }
    return;
  }

  if (controller) {
    controller.abort(); // Abort any previous request
  }
  controller = new AbortController(); // Create a new controller for the new request
  activeRequest = requestId; // Track the current active request

  try {
    const data = await fetchData(key, controller.signal);
    if (activeRequest !== requestId) {
      return; // Ignore the response if this request has been superseded
    }
    postMessage({data, requestId});
  } catch (error) {
    if (activeRequest !== requestId) {
      return; // Ignore the error if this request has been superseded
    }
    postMessage({error: error instanceof Error ? error.message : 'Unknown error', requestId});
  }
};

export {};
