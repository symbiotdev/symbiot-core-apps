import { App, getAppSyncPaths, realAppName, selectApp } from './utils/app';
import { Env, selectEnv } from './utils/env';
import { BuildType, selectBuildType } from './utils/build-type';
import { Platform, selectPlatform } from './utils/platform';
import { syncAppJson, syncFiles } from './utils/sync-files';
import { getPrebuildCommand } from './utils/nx-expo';
import { spawn } from 'child_process';
import { rm } from 'node:fs/promises';

(async () => {
  console.log(`Starting... 🚀🚀`);

  const app = await selectApp();
  const env = await selectEnv();
  const platform = await selectPlatform();
  const buildType =
    env === Env.production ? await selectBuildType() : BuildType.livereaload;
  const syncPaths = getAppSyncPaths({ app, env });
  const fileWatchers = await Promise.all(syncPaths.map(syncFiles));
  const { watcher: appJsonWatcher, reset: resetAppJson } = await syncAppJson({
    app,
  });

  const startCommand = getStartCommand({ app, env, platform, buildType });

  const childProcess = spawn(startCommand, {
    stdio: 'inherit',
    shell: true,
  });

  console.log('>_ Start command: ', startCommand);

  childProcess.on('close', () => {
    appJsonWatcher.close();
    resetAppJson();

    fileWatchers.forEach((watcher) => watcher.close());
    syncPaths.forEach(({ dest }) => rm(dest, { recursive: true }));
  });
})();

const getStartCommand = ({
  app,
  env,
  platform,
  buildType,
}: {
  app: App;
  env: Env;
  platform: Platform;
  buildType: BuildType;
}) => {
  const appName = realAppName[app];
  const isRelease = env === Env.production && buildType === BuildType.release;

  if (platform !== Platform.web) {
    const prebuildCommand = getPrebuildCommand({ appName, platform });
    const configuration = isRelease
      ? `${
          platform === Platform.ios
            ? '--configuration=Release'
            : '--variant=release'
        }`
      : '';

    return `nx reset && ${prebuildCommand} && nx run ${appName}:run-${platform} -- --device ${configuration}`;
  } else {
    const additionalParams = isRelease
      ? '-- --no-dev --minify --clear'
      : '-- --clear';

    return `nx reset && nx start ${appName} ${additionalParams}`;
  }
};
