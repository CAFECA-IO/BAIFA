// workerSingleton.ts
let instance: Worker | null = null;

export const getWorkerInstance = () => {
  if (instance === null) {
    instance = new Worker(new URL('./data_fetcher_worker', import.meta.url), {type: 'module'});
  }
  return instance;
};
