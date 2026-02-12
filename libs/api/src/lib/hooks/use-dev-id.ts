import { useEffect, useState } from 'react';
import * as Application from 'expo-application';
import { randomUUID } from 'expo-crypto';
import { isAndroid, isIos, mmkvGlobalStorage } from '@symbiot-core-apps/shared';

const DEV_ID_STORE_KEY = 'wid';

const storeNewId = () => {
  const id = randomUUID();

  mmkvGlobalStorage.set(DEV_ID_STORE_KEY, id);

  return id;
};

export const useDevId = () => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (isIos) {
      Application.getIosIdForVendorAsync().then((id) => {
        setId(id || storeNewId());
      });
    } else if (isAndroid) {
      setId(Application.getAndroidId() || storeNewId());
    } else {
      setId(mmkvGlobalStorage.getString(DEV_ID_STORE_KEY) || storeNewId());
    }
  }, []);

  return id;
};
