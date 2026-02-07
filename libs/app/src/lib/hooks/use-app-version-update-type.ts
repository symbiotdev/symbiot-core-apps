import { useAppState } from './use-app-state';
import { useMemo } from 'react';
import { Platform } from 'react-native';
import { DeviceVersion } from '@symbiot-core-apps/shared';

export const useAppVersionUpdateType = () => {
  const { versionDetails } = useAppState();

  const updateType = useMemo(() => {
    if (!versionDetails || Platform.OS === 'web') return;
    else if (versionDetails.minSupported > DeviceVersion) return 'mandatory';
    else return 'optional';
  }, [versionDetails]);

  return {
    updateType,
    versionDetails,
  };
};
