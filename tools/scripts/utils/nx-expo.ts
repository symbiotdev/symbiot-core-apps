import { Platform } from './platform';

export const getPrebuildCommand = ({
  appName,
  platform,
}: {
  appName: string;
  platform: Platform;
}) => `nx run ${appName}:prebuild -- --platform=${platform}`;
