// workerSingleton.ts
let instance: Worker | null = null;
let n = 0;

export const getWorkerInstance = (): Worker => {
  if (instance === null) {
    instance = new Worker(new URL('./data_fetcher_worker', import.meta.url), {type: 'module'});
    n++;
  }

  // eslint-disable-next-line no-console
  console.log('instance', instance, 'n', n);

  return instance;
};
