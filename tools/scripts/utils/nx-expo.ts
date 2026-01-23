import { Platform } from './platform';
import { Env } from './env';
import { BuildSource } from './build-source';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'node:fs';
import { App, appConfig } from './app';

export const getEasProfile = ({
  env,
  buildSource,
}: {
  env: Env;
  buildSource: BuildSource;
}) => `${env}_${buildSource}`;

export const getPrebuildCommand = ({
  app,
  platform,
}: {
  app: App;
  platform: Platform;
}) => {
  const { name } = appConfig[app];

  return `nx run ${name}:prebuild -- --platform=${platform}`;
};

export const getBuildCommand = ({
  app,
  platform,
  easProfile,
  buildSource,
}: {
  app: App;
  easProfile: string;
  platform: Platform;
  buildSource: BuildSource;
}) => {
  const { name } = appConfig[app];

  return `nx run ${name}:build -- --profile=${easProfile} --platform=${platform} --clear-cache ${
    buildSource.indexOf('local') !== -1 ? '--local' : ''
  }`;
};

export const getSubmitCommand = ({
  app,
  easProfile,
  buildSource,
}: {
  app: App;
  easProfile: string;
  buildSource: BuildSource;
}) => {
  const { name } = appConfig[app];

  return buildSource === BuildSource.store
    ? `nx submit ${name} -- --profile=${easProfile}`
    : 'echo "Ready!"';
};

export const getExportCommand = ({ app }: { app: App }) => {
  const { name } = appConfig[app];

  return `nx run ${name}:export --platform=web --clear --skip-nx-cache`;
};

export const addEnvToEasConfig = ({ app, env }: { app: App; env: Env }) => {
  const { dest } = appConfig[app];
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
  const { dest } = appConfig[app];
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
