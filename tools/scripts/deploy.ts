import { getAppSyncPaths, realAppName, selectApp } from './utils/app';
import { Env, selectEnv } from './utils/env';
import { selectPlatform } from './utils/platform';
import { selectIncrement } from './utils/increment';
import { selectBuildSource } from './utils/build-source';
import {
  addEnvToEasConfig,
  getBuildCommand,
  getEasProfile,
  getPrebuildCommand,
  getSubmitCommand,
  removeEnvFromEasConfig,
} from './utils/nx-expo';
import { syncAppJson, syncFiles } from './utils/sync-files';
import { spawn } from 'child_process';
import { rm } from 'node:fs/promises';

(async () => {
  console.log(`Deploying... 📦⬆️`);

  const app = await selectApp();
  const env = await selectEnv({ ignoreLocal: true });
  const platform = await selectPlatform({ nativeOnly: true });
  const buildSource = await selectBuildSource({ env });
  const increment = await selectIncrement({ env });
  const easProfile = getEasProfile({
    buildSource,
    env: env.split('_')[0] as Env,
  });
  const appName = realAppName[app];
  const prebuildCommand = getPrebuildCommand({ appName, platform });
  const buildCommand = getBuildCommand({
    appName,
    platform,
    easProfile,
    buildSource,
  });
  const submitCommand = getSubmitCommand({ appName, easProfile, buildSource });
  const syncPaths = getAppSyncPaths({ app, env });
  const fileWatchers = await Promise.all(syncPaths.map(syncFiles));
  const { watcher: appJsonWatcher, reset: resetAppJson } = await syncAppJson({
    app,
    platform,
    increment,
  });

  addEnvToEasConfig({ app, env });

  const childProcess = spawn(
    `nx reset && ${prebuildCommand} && ${buildCommand} && ${submitCommand}`,
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  childProcess.on('close', () => {
    removeEnvFromEasConfig({ app, env });

    appJsonWatcher.close();
    resetAppJson();

    fileWatchers.forEach((watcher) => watcher.close());
    syncPaths.forEach(({ dest }) => rm(dest, { recursive: true }));

    console.log(`✅ Deployed... 🚀`);
  });
})();
