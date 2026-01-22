import { Increment } from './increment';
import { copyFile, cp, mkdir, rm } from 'node:fs/promises';
import { readFileSync, writeFileSync } from 'node:fs';
import * as dotenv from 'dotenv';
import { Platform } from './platform';
import chokidar from 'chokidar';
import { App, appBuildConfigPath, appPath } from './app';

export const syncFiles = async ({
  src,
  dest,
}: {
  src: string;
  dest: string;
}) => {
  await cp(src, dest, { recursive: true });

  const watcher = chokidar.watch(src);
  const sync = async ({
    path,
    type,
  }: {
    path: string;
    type: 'copyFile' | 'removePath' | 'addDir';
  }) => {
    const appPath = path.replace(src, dest);

    if (type === 'copyFile') {
      await copyFile(path, appPath);
    } else if (type === 'removePath') {
      await rm(appPath, { recursive: true });
    } else if (type === 'addDir') {
      await mkdir(appPath, { recursive: true });
    }
  };

  watcher
    .on('add', (path) => sync({ path, type: 'copyFile' }))
    .on('change', (path) => sync({ path, type: 'copyFile' }))
    .on('unlink', (path) => sync({ path, type: 'removePath' }))
    .on('addDir', (path) => sync({ path, type: 'addDir' }))
    .on('unlinkDir', (path) => sync({ path, type: 'removePath' }));

  return watcher;
};

export const syncAppJson = async ({
  app,
  platform,
  increment,
}: {
  app: App;
  platform?: Platform;
  increment?: Increment;
}) => {
  const appFilePath = `${appPath[app]}/app.json`;
  const configFilePath = `${appBuildConfigPath[app]}/app.json`;
  const config = JSON.parse(readFileSync(configFilePath, 'utf8'));
  const initialAppJson = JSON.parse(readFileSync(appFilePath, 'utf8'));

  if (increment && increment !== Increment.skip) {
    config.expo.version = config.expo.version
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
      config.expo.ios.buildNumber = String(
        Number(config.expo.ios.buildNumber) + 1,
      );
    }

    if (platform === Platform.android) {
      config.expo.android.versionCode += 1;
    }

    writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8');
  }

  const watcher = chokidar.watch(configFilePath);
  const sync = () => {
    try {
      const envJson = dotenv.parse(
        readFileSync(`${appPath[app]}/.env`, 'utf8'),
      );
      const appJson = JSON.parse(readFileSync(appFilePath, 'utf8'));
      const configJson = JSON.parse(readFileSync(configFilePath, 'utf8'));

      appJson.expo.name = configJson.expo.name;
      appJson.expo.slug = configJson.expo.slug;
      appJson.expo.scheme = configJson.expo.scheme;
      appJson.expo.version = configJson.expo.version;
      appJson.expo.extra = configJson.expo.extra;
      appJson.expo.ios.bundleIdentifier = envJson['EXPO_PUBLIC_APP_ID'];
      appJson.expo.ios.buildNumber = configJson.expo.ios.buildNumber;
      appJson.expo.android.package = envJson['EXPO_PUBLIC_APP_ID'];
      appJson.expo.android.versionCode = configJson.expo.android.versionCode;

      writeFileSync(appFilePath, JSON.stringify(appJson, null, 2), 'utf8');
    } catch (err) {
      console.log('error', err);
    }
  };

  sync();

  watcher.on('change', sync);

  return {
    watcher,
    reset: () =>
      writeFileSync(
        appFilePath,
        JSON.stringify(initialAppJson, null, 2),
        'utf8',
      ),
  };
};
