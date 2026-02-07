import { Platform } from 'react-native';

export type PlatformVersionDetails = {
  latest: string;
  minSupported: string;
};

export type AppDetails = {
  version?: Record<typeof Platform.OS, PlatformVersionDetails>;
};
