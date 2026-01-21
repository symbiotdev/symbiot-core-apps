import { App, realAppName, selectApp } from './utils/app';
import { Env, selectEnv } from './utils/env';
import { BuildType, selectBuildType } from './utils/build-type';
import { Platform, selectPlatform } from './utils/platform';
import { syncAssets } from './utils/assets';
import { getPrebuildCommand } from './utils/nx-expo';
import { spawn } from 'child_process';

(async () => {
  console.log(`Starting... 🚀🚀`);

  const app = await selectApp();
  const env = await selectEnv();
  const platform = await selectPlatform();
  const buildType =
    env === Env.production ? await selectBuildType() : BuildType.livereaload;

  await syncAssets({ app, env });

  const startCommand = getStartCommand({
    app,
    env,
    platform,
    buildType,
  });

  spawn(startCommand, {
    stdio: 'inherit',
    shell: true,
  });

  console.log('>_ Start command: ', startCommand);
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
    const prebuild = getPrebuildCommand({ appName, platform });
    const configuration = isRelease
      ? `${
          platform === Platform.ios
            ? '--configuration=Release'
            : '--variant=release'
        }`
      : '';

    return `nx reset && ${prebuild} && nx run ${appName}:run-${platform} -- --device ${configuration}`;
  } else {
    const additionalParams = isRelease
      ? '-- --no-dev --minify --clear'
      : '-- --clear';

    return `nx reset && nx start ${appName} ${additionalParams}`;
  }
};
