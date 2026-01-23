import { getAppConfig, getAppSyncPaths } from './utils/app';
import { Env, selectEnv } from './utils/env';
import { selectPlatform } from './utils/platform';
import { selectIncrement } from './utils/increment';
import { selectBuildSource } from './utils/build-source';
import {
  getBuildCommand,
  getPrebuildCommand,
  getSubmitCommand,
} from './utils/nx-expo';
import { syncFiles } from './utils/sync-files';
import { spawn } from 'child_process';
import { rm } from 'node:fs/promises';
import { syncAppJson } from './utils/expo-app-json';
import {
  addEasJsonFile,
  addEnvToEasConfig,
  getEasProfile,
  removeEasJsonFile,
} from './utils/expo-eas-json';

(async () => {
  console.log(`Deploying... 📦⬆️`);

  const {
    app,
    dynamicAppJson,
    supportDeployPlatforms: supportedPlatforms,
  } = await getAppConfig();
  const env = await selectEnv({ ignoreLocal: true });
  const platform = await selectPlatform({
    platforms: supportedPlatforms,
    nativeOnly: true,
  });
  const buildSource = await selectBuildSource({ env });
  const increment = await selectIncrement({ env });
  const profile = getEasProfile({
    buildSource,
    env: env.split('_')[0] as Env,
  });
  const prebuildCommand = getPrebuildCommand({ app, platform });
  const buildCommand = getBuildCommand({ app, platform, profile, buildSource });
  const submitCommand = getSubmitCommand({ app, profile, buildSource });
  const syncPaths = getAppSyncPaths({ app, env });
  const fileWatchers = await Promise.all(syncPaths.map(syncFiles));
  const appJson = await syncAppJson({
    app,
    platform,
    increment,
    dynamic: dynamicAppJson,
  });

  await addEasJsonFile({ app });
  addEnvToEasConfig({ app, env });

  const childProcess = spawn(
    `nx reset && ${prebuildCommand} && ${buildCommand} && ${submitCommand}`,
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  childProcess.on('exit', () => {
    removeEasJsonFile({ app });
    appJson.reset();

    fileWatchers.forEach((watcher) => watcher.close());
    syncPaths.forEach(({ dest }) => rm(dest, { recursive: true }));

    console.log(`✅ Deployed... 🚀`);
  });
})();
