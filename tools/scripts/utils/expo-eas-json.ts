import { App, appBuildConfigPath, appConfig } from './app';
import { copyFile, rm } from 'node:fs/promises';
import { Env } from './env';
import { BuildSource } from './build-source';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from 'node:fs';

export const getEasProfile = ({
  env,
  buildSource,
}: {
  env: Env;
  buildSource: BuildSource;
}) => `${env}_${buildSource}`;

export const addEasJsonFile = async ({ app }: { app: App }) => {
  const { dest } = appConfig[app];

  await copyFile(`${appBuildConfigPath}/eas.json`, `${dest}/eas.json`);
};

export const removeEasJsonFile = async ({ app }: { app: App }) => {
  const { dest } = appConfig[app];

  await rm(`${dest}/eas.json`, { recursive: true });
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
