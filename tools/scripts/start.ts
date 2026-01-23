import { getAppConfig, getAppSyncPaths } from './utils/app';
import { Env, selectEnv } from './utils/env';
import { BuildType, selectBuildType } from './utils/build-type';
import { selectPlatform } from './utils/platform';
import { syncFiles } from './utils/sync-files';
import { spawn } from 'child_process';
import { rm } from 'node:fs/promises';
import { syncAppJson } from './utils/expo-app-json';
import { getStartCommand } from './utils/nx-expo';

(async () => {
  console.log(`Starting... 🚀🚀`);

  const { app, dynamicAppJson, supportDevPlatforms } = await getAppConfig();
  const env = await selectEnv();
  const platform = await selectPlatform({ platforms: supportDevPlatforms });
  const buildType =
    env === Env.production ? await selectBuildType() : BuildType.livereaload;
  const syncPaths = getAppSyncPaths({ app, env });
  const fileWatchers = await Promise.all(syncPaths.map(syncFiles));
  const appJson = await syncAppJson({ dynamic: dynamicAppJson, app });
  const startCommand = getStartCommand({ app, env, platform, buildType });
  const childProcess = spawn(startCommand, {
    stdio: 'inherit',
    shell: true,
  });

  console.log('>_ Start command: ', startCommand);

  childProcess.on('exit', () => {
    appJson.reset();

    fileWatchers.forEach((watcher) => watcher.close());
    syncPaths.forEach(({ dest }) => rm(dest, { recursive: true }));
  });
})();
