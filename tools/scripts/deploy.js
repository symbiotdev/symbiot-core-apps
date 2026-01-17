import {
  addEnvToEasConfig,
  getApp,
  getBuildCommand,
  getBuildTo,
  getEasProfile,
  getEnv,
  getIncrementType,
  getPlatform,
  getPrebuildCommand,
  getSubmitCommand,
  mergeAppAssets,
  removeEnvFromEasConfig,
} from './app.mjs';
import { spawn } from 'child_process';

(async () => {
  console.log(`Deploying... 📦⬆️`);

  const app = await getApp();
  const env = await getEnv(true);
  const platform = await getPlatform(true);
  const buildTo = await getBuildTo(env);
  const incrementType = await getIncrementType(env);
  const buildApp = 'service-based-business';
  const profile = getEasProfile(env.split('_')[0], buildTo);
  const prebuild = getPrebuildCommand(buildApp, platform);
  const build = getBuildCommand(buildApp, profile, platform, buildTo);
  const submit = getSubmitCommand(buildApp, profile, build);

  await mergeAppAssets(app, buildApp, env, incrementType, platform);
  addEnvToEasConfig(buildApp, env, profile);

  const childProcess = spawn(
    `nx reset && ${prebuild} && ${build} && ${submit}`,
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  childProcess.on('close', () => {
    removeEnvFromEasConfig(buildApp, profile);
  });
})();
