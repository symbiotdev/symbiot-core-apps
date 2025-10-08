import { mmkvGlobalStorage } from '@symbiot-core-apps/storage';

const storeKeyPrefix = 'initial-query-data';

export const getInitialQueryDataStoreQueryKey = (queryKey: unknown[]) => {
  return `${storeKeyPrefix}-${queryKey.map(String).join('/')}`;
};

export const clearInitialQueryData = () => {
  mmkvGlobalStorage
    .getAllKeys()
    .filter((key) => key.indexOf(storeKeyPrefix) === 0)
    .forEach((key) => {
      mmkvGlobalStorage.delete(key)
    });
};
