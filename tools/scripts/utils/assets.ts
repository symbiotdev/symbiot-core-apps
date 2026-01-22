import { App, appBuildConfigPath, appDestinationPath } from './app';
import { Env } from './env';
import { Increment } from './increment';
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from 'node:fs/promises';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'node:fs';
import * as dotenv from 'dotenv';
import { Platform } from './platform';

export const syncAssets = async ({
  app,
  env,
  platform,
  increment = Increment.skip,
}: {
  app: App;
  env: Env;
  platform?: Platform;
  increment?: Increment;
}): Promise<void> => {
  const sourcePath = appBuildConfigPath[app];
  const destinationPath = appDestinationPath[app];

  if (!sourcePath || !destinationPath) return;

  await copyFiles({
    type: 'Assets',
    src: `${sourcePath}/assets`,
    dest: `${destinationPath}/assets`,
  });

  await copyFiles({
    type: 'i18n',
    src: `${sourcePath}/i18n`,
    dest: `${destinationPath}/i18n`,
  });

  await copyFiles({
    type: 'Google',
    src: `${sourcePath}/google/${env.split('_')[0]}/`,
    dest: `${destinationPath}/google`,
  });

  await createEnvFile({
    src: `${sourcePath}/.env.${env}`,
    dest: `${destinationPath}/.env`,
  });

  await updateAppJson({
    platform,
    increment,
    envPath: `${destinationPath}/.env`,
    src: `${sourcePath}/app.json`,
    dest: `${destinationPath}/app.json`,
  });
};

const copyFiles = async ({
  type,
  src,
  dest,
  ignoreLog,
}: {
  type: string;
  src: string;
  dest: string;
  ignoreLog?: boolean;
}) => {
  const stats = await stat(src);

  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);

    for (const entry of entries) {
      await copyFiles({
        type,
        ignoreLog: true,
        src: join(src, entry),
        dest: join(dest, entry),
      });
    }
  } else {
    await copyFile(src, dest);
  }

  if (!ignoreLog) console.log(`📁 ${type} copied! ➕`);
};

const createEnvFile = async ({ src, dest }: { src: string; dest: string }) => {
  await writeFile(dest, await readFile(src));

  console.log(`📁 .env created! ➕`);
};

const updateAppJson = async ({
  src,
  dest,
  envPath,
  platform,
  increment,
}: {
  src: string;
  dest: string;
  envPath: string;
  platform?: Platform;
  increment?: Increment;
}) => {
  if (!src || !dest) return;

  const appConfig = JSON.parse(readFileSync(src, 'utf8'));
  const destConfig = JSON.parse(readFileSync(dest, 'utf8'));
  const envConfig = dotenv.parse(readFileSync(envPath, 'utf8'));

  if (increment && increment !== Increment.skip) {
    appConfig.expo.version = appConfig.expo.version
      .split('.')
      .map((value: Increment, index: number) => {
        if (increment === Increment.major) {
          return index === 0 ? Number(value) + 1 : 0;
        } else if (increment === Increment.minor) {
          if (index === 1) {
            return Number(value) + 1;
          } else {
            return index > 1 ? 0 : value;
          }
        } else if (increment === Increment.patch) {
          if (index === 2) {
            return Number(value) + 1;
          } else {
            return index > 2 ? 0 : value;
          }
        } else {
          return value;
        }
      })
      .join('.');

    if (platform === Platform.ios) {
      appConfig.expo.ios.buildNumber = String(
        Number(appConfig.expo.ios.buildNumber) + 1,
      );
    }

    if (platform === Platform.android) {
      appConfig.expo.android.versionCode += 1;
    }

    writeFileSync(src, JSON.stringify(appConfig, null, 2), 'utf8');
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

  writeFileSync(dest, JSON.stringify(destConfig, null, 2), 'utf8');

  console.log(`📁 app.json updated! ➕`);
};
