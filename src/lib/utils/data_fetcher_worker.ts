/// <reference lib="webworker" />

interface FetchRequestData {
  key: string;
  requestId: string;
  query?: Record<string, string | number>;
  action?: 'cancel';
}

let activeRequest: string | null = null;
let controller: AbortController | null = null;

async function fetchData(
  api: string,
  query: Record<string, string | number> = {},
  signal: AbortSignal
): Promise<unknown> {
  let url;
  const queryString = Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
    .join('&');

  if (queryString) {
    url = `${api}?${queryString}`;
  } else {
    url = `${api}`;
  }

  return fetch(url, {signal}).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  });
}

self.onmessage = async (event: MessageEvent<FetchRequestData>) => {
  const {key, requestId, query, action} = event.data;

  if (action === 'cancel') {
    if (activeRequest === requestId) {
      if (controller) {
        controller.abort();
        controller = null;
        // Info: after 1 sec, terminate itself (20240227 - Shirley)
        setTimeout(() => {
          self.close();
        }, 1000);
      }
    }
    return;
  }

  if (controller) {
    controller.abort();
  }
  controller = new AbortController();
  activeRequest = requestId;

  try {
    const data = await fetchData(key, query || {}, controller.signal);
    if (activeRequest !== requestId) {
      return;
    }
    postMessage({data, requestId});
  } catch (error) {
    if (activeRequest !== requestId) {
      return;
    }
    postMessage({error: error instanceof Error ? error.message : 'Unknown error', requestId});
  }
};

export {};
