import { DeiceOS } from '@symbiot-core-apps/shared';

export type PlatformVersionDetails = {
  latest: string;
  minSupported: string;
};

export type AppDetails = {
  version?: Record<typeof DeiceOS, PlatformVersionDetails>;
};
