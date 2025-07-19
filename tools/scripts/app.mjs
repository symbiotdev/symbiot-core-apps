import { select } from '@inquirer/prompts';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getApp = async () =>
  process.env['NODE_APP'] ||
  (await select({
    message: 'Application',
    choices: [
      {
        name: 'DanceHub',
        value: 'dance-hub',
      },
      {
        name: 'Spanday',
        value: 'spanday',
      },
      {
        name: 'Symbiot',
        value: 'symbiot',
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
    buildTo === 'local' ? '--local' : ''
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
    const additionalParams = env === 'production' ? '-- --no-dev --minify' : '';

    return `nx reset && nx start ${app} --clear ${additionalParams}`;
  }
};

export const getBuildTo = (env) => select({
  message: 'Build',
  choices: [
    {
      name: 'Local',
      value: 'local',
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
})

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
      {
        name: 'Bump buildNumber & versionCode',
        value: 'bump',
      },
    ],
  });

export const getEnvConfig = (app, env) =>
  dotenv.parse(
    fs.readFileSync(`${__dirname}/../../apps/${app}/.env.${env}`, 'utf8')
  );

export const updateAppConfig = (app, env, incrementType) => {
  const appConfigPath = `${__dirname}/../../apps/${app}/app.json`;
  const appConfig = fs.readFileSync(appConfigPath, 'utf8');
  const updatedAppConfig = JSON.parse(appConfig);
  const envConfig = getEnvConfig(app, env);

  updatedAppConfig.expo.name = envConfig['EXPO_PUBLIC_APP_NAME'];

  updatedAppConfig.expo.ios.bundleIdentifier = envConfig['EXPO_PUBLIC_APP_ID'];
  updatedAppConfig.expo.ios.googleServicesFile = `./google/${envConfig['EXPO_PUBLIC_APP_VARIANT']}/GoogleService-Info.plist`;

  updatedAppConfig.expo.android.package = envConfig['EXPO_PUBLIC_APP_ID'];
  updatedAppConfig.expo.android.googleServicesFile = `./google/${envConfig['EXPO_PUBLIC_APP_VARIANT']}/google-services.json`;

  if (incrementType) {
    updatedAppConfig.expo.version = updatedAppConfig.expo.version.replace(
      /version:\s*'(\d+)\.(\d+)\.(\d+)'/,
      (match, major, minor, patch) => {
        if (incrementType === 'major') {
          major = parseInt(major, 10) + 1;
        }

        if (incrementType === 'minor') {
          minor = parseInt(minor, 10) + 1;
        }

        if (incrementType === 'patch') {
          patch = parseInt(patch, 10) + 1;
        }

        return `version: '${major}.${minor}.${patch}'`;
      }
    );

    updatedAppConfig.expo.ios.buildNumber = String(
      parseInt(updatedAppConfig.expo.ios.buildNumber, 10) + 1
    );
    updatedAppConfig.expo.android.versionCode =
      updatedAppConfig.expo.android.versionCode + 1;
  }

  fs.writeFileSync(
    appConfigPath,
    JSON.stringify(updatedAppConfig, null, 2),
    'utf8'
  );
};

export const updateEasConfig = (app, env, profile) => {
  const envConfig = getEnvConfig(app, env);
  const easConfigPath = `${__dirname}/../../apps/${app}/eas.json`;
  const easConfig = fs.readFileSync(easConfigPath, 'utf8');
  const updatedEasConfig = JSON.parse(easConfig);

  updatedEasConfig['build'][profile.split('_')[0]]['env'] = envConfig;

  fs.writeFileSync(
    easConfigPath,
    JSON.stringify(updatedEasConfig, null, 2),
    'utf8'
  );
};
