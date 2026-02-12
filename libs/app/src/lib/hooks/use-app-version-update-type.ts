import { useAppState } from './use-app-state';
import { useMemo } from 'react';
import { DeviceVersion, isWeb } from '@symbiot-core-apps/shared';

export const useAppVersionUpdateType = () => {
  const { versionDetails } = useAppState();

  const updateType = useMemo(() => {
    if (!versionDetails || versionDetails.latest <= DeviceVersion || isWeb)
      return;
    else if (versionDetails.minSupported > DeviceVersion) return 'mandatory';
    else return 'optional';
  }, [versionDetails]);

  return {
    updateType,
    versionDetails,
  };
};
