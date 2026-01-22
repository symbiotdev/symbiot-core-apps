import { realAppName, selectApp } from './utils/app';
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
import { syncAssets } from './utils/assets';
import { spawn } from 'child_process';

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

  await syncAssets({ app, env, platform, increment });

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
  });
})();
