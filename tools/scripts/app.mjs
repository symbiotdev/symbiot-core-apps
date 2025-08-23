import path from 'path';
import dotenv from 'dotenv';
import { select } from '@inquirer/prompts';
import { fileURLToPath } from 'url';
import { copyFiles, createEnvFile } from './utils.mjs';
import { readFileSync, writeFileSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getApp = async () =>
  process.env['NODE_APP'] ||
  (await select({
    message: 'Application',
    choices: [
      {
        name: 'DanceHub by Symbiot',
        value: 'symbiothub-dance',
      },
      {
        name: 'Spanday',
        value: 'spanday',
      },
    ],
  }));

export const getEnv = (ignoreLocal = false) =>
  select({
    message: 'Environment',
    choices: [
      ...(!ignoreLocal
        ? [
            {
              name: '[Local] Development',
              value: 'development_local',
            },
          ]
        : []),
      {
        name: 'Development',
        value: 'development',
      },
      {
        name: 'Production',
        value: 'production',
      },
    ],
  });

export const getPlatform = (nativeOnly = false) =>
  select({
    message: 'Platform',
    choices: [
      ...(!nativeOnly
        ? [
            {
              name: 'Web',
              value: 'web',
            },
          ]
        : []),
      {
        name: 'IOS',
        value: 'ios',
      },
      {
        name: 'Android',
        value: 'android',
      },
    ],
  });

export const getEasProfile = (env, buildTo) => `${env}_${buildTo}`;

export const getExportCommand = (app) =>
  `nx run ${app}:export --platform=web --clear --skip-nx-cache`;

export const getPrebuildCommand = (app, platform) =>
  `nx run ${app}:prebuild -- --platform=${platform}`;

export const getBuildCommand = (app, profile, platform, buildTo) =>
  `nx run ${app}:build -- --profile=${profile} --platform=${platform} --clear-cache ${
    buildTo.indexOf('local') !== -1 ? '--local' : ''
  }`;

export const getSubmitCommand = (app, profile, buildTo) =>
  buildTo === 'store'
    ? `nx submit ${app} -- --profile=${profile}`
    : 'echo "Ready!"';

export const getStartCommand = (app, env, platform) => {
  const prebuild = getPrebuildCommand(app, platform);

  if (platform !== 'web') {
    const buildType =
      env === 'production'
        ? platform === 'ios'
          ? '--configuration=Release'
          : '--variant=release'
        : '';

    return `nx reset && ${prebuild} && nx run ${app}:run-${platform} -- --device ${buildType}`;
  } else {
    const additionalParams =
      env === 'production' ? '-- --no-dev --minify --clear' : '-- --clear';

    return `nx reset && nx start ${app} ${additionalParams}`;
  }
};

export const getBuildTo = (env) =>
  select({
    message: 'Build',
    choices: [
      {
        name: 'Local',
        value: 'local',
      },
      {
        name: 'Local Device',
        value: 'device_local',
      },
      {
        name: 'EAS',
        value: 'eas',
      },
      {
        name: 'EAS Device',
        value: 'device',
      },
      ...(env === 'development'
        ? []
        : [
            {
              name: 'Store',
              value: 'store',
            },
          ]),
    ],
  });

export const getIncrementType = (env) =>
  env === 'production' &&
  select({
    message: 'Increment',
    choices: [
      {
        name: 'Skip',
        value: '',
      },
      {
        name: 'Bump buildNumber & versionCode',
        value: 'bump',
      },
      {
        name: 'Major',
        value: 'major',
      },
      {
        name: 'Minor',
        value: 'minor',
      },
      {
        name: 'Patch',
        value: 'patch',
      },
    ],
  });

export const getEnvConfig = (app, env) =>
  dotenv.parse(
    readFileSync(`${__dirname}/../../apps/${app}/.env.${env}`, 'utf8'),
  );

export const updateAppJson = async (app, dest, incrementType) => {
  const appConfigPath = `${__dirname}/../../app-assets/${app}/config/app.json`;
  const appConfig = JSON.parse(readFileSync(appConfigPath, 'utf8'));
  const destConfigPath = `${dest}/app.json`;
  const destConfig = JSON.parse(readFileSync(destConfigPath, 'utf8'));
  const envConfig = dotenv.parse(readFileSync(`${dest}/.env`, 'utf8'));

  if (incrementType) {
    appConfig.expo.version = appConfig.expo.version
      .split('.')
      .map((value, index) =>
        (incrementType === 'major' && index === 0) ||
        (incrementType === 'minor' && index === 1) ||
        (incrementType === 'patch' && index === 2)
          ? Number(value) + 1
          : value,
      )
      .join('.');

    appConfig.expo.ios.buildNumber = String(
      Number(appConfig.expo.ios.buildNumber) + 1,
    );
    appConfig.expo.android.versionCode += 1;

    writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2), 'utf8');
  }

  destConfig.expo.name = appConfig.expo.name;
  destConfig.expo.slug = appConfig.expo.slug;
  destConfig.expo.scheme = appConfig.expo.scheme;
  destConfig.expo.version = appConfig.expo.version;
  destConfig.expo.extra = appConfig.expo.extra;
  destConfig.expo.ios.bundleIdentifier = envConfig['EXPO_PUBLIC_APP_ID'];
  destConfig.expo.ios.buildNumber = appConfig.expo.ios.buildNumber;
  destConfig.expo.android.package = envConfig['EXPO_PUBLIC_APP_ID'];
  destConfig.expo.android.versionCode = appConfig.expo.android.versionCode;

  writeFileSync(destConfigPath, JSON.stringify(destConfig, null, 2), 'utf8');
};

export const mergeAppAssets = async (baseApp, buildApp, env, incrementType) => {
  const appAssetsPath = `${__dirname}/../../app-assets/${baseApp}`;
  const appPath = `${__dirname}/../../apps/${buildApp}`;

  await copyFiles(`${appAssetsPath}/assets`, `${appPath}/assets`);
  console.log(`📁 Assets copied! ➕`);
  await copyFiles(
    `${appAssetsPath}/google/${env.split('_')[0]}/`,
    `${appPath}/google`,
  );
  console.log(`📁 Google copied! ➕`);
  await createEnvFile(`${appAssetsPath}/env/.env.${env}`, `${appPath}/.env`);
  console.log(`📁 .env created! ➕`);
  await updateAppJson(baseApp, appPath, incrementType);
  console.log(`📁 app.json updated! ➕`);
};

export const addEnvToEasConfig = (app, env, profile) => {
  const envConfig = dotenv.parse(
    readFileSync(`${__dirname}/../../apps/${app}/.env`, 'utf8'),
  );
  const easConfigPath = `${__dirname}/../../apps/${app}/eas.json`;
  const easConfig = readFileSync(easConfigPath, 'utf8');
  const updatedEasConfig = JSON.parse(easConfig);

  updatedEasConfig['build'][profile.split('_')[0]]['env'] = envConfig;

  writeFileSync(
    easConfigPath,
    JSON.stringify(updatedEasConfig, null, 2),
    'utf8',
  );
};

export const removeEnvFromEasConfig = (app, profile) => {
  const easConfigPath = `${__dirname}/../../apps/${app}/eas.json`;
  const easConfig = readFileSync(easConfigPath, 'utf8');
  const updatedEasConfig = JSON.parse(easConfig);

  delete updatedEasConfig['build'][profile.split('_')[0]]['env'];

  writeFileSync(
    easConfigPath,
    JSON.stringify(updatedEasConfig, null, 2),
    'utf8',
  );
};
