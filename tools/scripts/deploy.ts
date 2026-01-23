import { getAppSyncPaths, selectApp } from './utils/app';
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
import { syncFiles } from './utils/sync-files';
import { spawn } from 'child_process';
import { rm } from 'node:fs/promises';
import { syncAppJson } from './utils/expo-app-json';

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
  const prebuildCommand = getPrebuildCommand({ app, platform });
  const buildCommand = getBuildCommand({
    app,
    platform,
    easProfile,
    buildSource,
  });
  const submitCommand = getSubmitCommand({ app, easProfile, buildSource });
  const syncPaths = getAppSyncPaths({ app, env });
  const fileWatchers = await Promise.all(syncPaths.map(syncFiles));
  const { reset: resetAppJson } = await syncAppJson({
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

  childProcess.on('exit', () => {
    removeEnvFromEasConfig({ app, env });
    resetAppJson();

    fileWatchers.forEach((watcher) => watcher.close());
    syncPaths.forEach(({ dest }) => rm(dest, { recursive: true }));

    console.log(`✅ Deployed... 🚀`);
  });
})();
