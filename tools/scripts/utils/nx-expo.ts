import { Platform } from './platform';
import { Env } from './env';
import { BuildSource } from './build-source';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'node:fs';
import { App, appPath } from './app';

export const getEasProfile = ({
  env,
  buildSource,
}: {
  env: Env;
  buildSource: BuildSource;
}) => `${env}_${buildSource}`;

export const getPrebuildCommand = ({
  appName,
  platform,
}: {
  appName: string;
  platform: Platform;
}) => `nx run ${appName}:prebuild -- --platform=${platform}`;

export const getBuildCommand = ({
  appName,
  platform,
  easProfile,
  buildSource,
}: {
  appName: string;
  easProfile: string;
  platform: Platform;
  buildSource: BuildSource;
}) =>
  `nx run ${appName}:build -- --profile=${easProfile} --platform=${platform} --clear-cache ${
    buildSource.indexOf('local') !== -1 ? '--local' : ''
  }`;

export const getSubmitCommand = ({
  appName,
  easProfile,
  buildSource,
}: {
  appName: string;
  easProfile: string;
  buildSource: BuildSource;
}) =>
  buildSource === BuildSource.store
    ? `nx submit ${appName} -- --profile=${easProfile}`
    : 'echo "Ready!"';

export const getExportCommand = ({ appName }: { appName: string }) =>
  `nx run ${appName}:export --platform=web --clear --skip-nx-cache`;

export const addEnvToEasConfig = ({ app, env }: { app: App; env: Env }) => {
  const dest = appPath[app];
  const envConfig = dotenv.parse(readFileSync(`${dest}/.env`, 'utf8'));
  const easConfigPath = `${dest}/eas.json`;
  const easConfig = readFileSync(easConfigPath, 'utf8');
  const updatedEasConfig = JSON.parse(easConfig);

  updatedEasConfig['build'][env]['env'] = envConfig;

  writeFileSync(
    easConfigPath,
    JSON.stringify(updatedEasConfig, null, 2),
    'utf8',
  );
};

export const removeEnvFromEasConfig = ({
  app,
  env,
}: {
  app: App;
  env: Env;
}) => {
  const dest = appPath[app];
  const easConfigPath = `${dest}/eas.json`;
  const easConfig = readFileSync(easConfigPath, 'utf8');
  const updatedEasConfig = JSON.parse(easConfig);

  delete updatedEasConfig['build'][env]['env'];

  writeFileSync(
    easConfigPath,
    JSON.stringify(updatedEasConfig, null, 2),
    'utf8',
  );
};
