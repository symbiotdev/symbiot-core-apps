import { App, appConfig } from './app';
import { Platform } from './platform';
import { Increment } from './increment';
import { readFileSync, writeFileSync } from 'node:fs';
import * as dotenv from 'dotenv';
// eslint-disable-next-line
// @ts-ignore
import { merge } from 'merge-anything';

type AppJson = {
  expo: {
    [key: string]: unknown;
    version: string;
    ios: {
      [key: string]: unknown;
      bundleIdentifier: string;
      buildNumber: string;
    };
    android: {
      [key: string]: unknown;
      package: string;
      versionCode: number;
    };
  };
};

export const syncAppJson = async ({
  app,
  dynamic,
  platform,
  increment,
}: {
  app: App;
  dynamic: boolean;
  platform?: Platform;
  increment?: Increment;
}) => {
  const { src, dest } = appConfig[app];
  const srcJsonPath = `${src}/app.json`;
  const destJsonPath = `${dest}/app.json`;
  const envJson = dotenv.parse(readFileSync(`${dest}/.env`, 'utf8'));
  const destJson = JSON.parse(readFileSync(destJsonPath, 'utf8'));
  const shouldIncrement = increment && increment !== Increment.skip;

  if (!dynamic) {
    if (shouldIncrement) {
      const updatedJson = getJsonWithIncrementation({
        platform,
        increment,
        json: destJson,
      });

      writeFileSync(destJsonPath, JSON.stringify(updatedJson, null, 2), 'utf8');
    }
  } else {
    let srcJson = JSON.parse(readFileSync(srcJsonPath, 'utf8'));

    if (shouldIncrement) {
      srcJson = getJsonWithIncrementation({
        platform,
        increment,
        json: srcJson,
      });

      writeFileSync(srcJsonPath, JSON.stringify(srcJson, null, 2), 'utf8');
    }

    const mergedJson = merge(destJson, srcJson);

    mergedJson.expo.ios.bundleIdentifier = envJson['EXPO_PUBLIC_APP_ID'];
    mergedJson.expo.android.package = envJson['EXPO_PUBLIC_APP_ID'];

    writeFileSync(destJsonPath, JSON.stringify(mergedJson, null, 2), 'utf8');
  }

  return {
    reset: () =>
      dynamic &&
      writeFileSync(destJsonPath, JSON.stringify(destJson, null, 2), 'utf8'),
  };
};

const getJsonWithIncrementation = ({
  json,
  platform,
  increment,
}: {
  json: AppJson;
  platform: Platform;
  increment: Increment;
}) => {
  json.expo.version = json.expo.version
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
    json.expo.ios.buildNumber = String(Number(json.expo.ios.buildNumber) + 1);
  }

  if (platform === Platform.android) {
    json.expo.android.versionCode += 1;
  }

  return json;
};
