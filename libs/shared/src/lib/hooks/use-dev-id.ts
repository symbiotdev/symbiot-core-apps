import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from 'expo-crypto';

const DEV_ID_STORE_KEY = 'wid';

const storeNewId = () => {
  const id = randomUUID();

  void AsyncStorage.setItem(DEV_ID_STORE_KEY, id);

  return id;
};

export const useDevId = () => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Application.getIosIdForVendorAsync().then((id) => {
        setId(id || storeNewId());
      });
    } else if (Platform.OS === 'android') {
      setId(Application.getAndroidId() || storeNewId());
    } else {
      AsyncStorage.getItem(DEV_ID_STORE_KEY).then((id) => {
        setId(id || storeNewId());
      });
    }
  }, []);

  return id;
};
