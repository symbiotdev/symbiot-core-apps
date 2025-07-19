import { spawn } from 'child_process';
import {
  getApp,
  getBuildCommand,
  getBuildTo,
  getEasProfile,
  getEnv,
  getIncrementType,
  getPlatform,
  getPrebuildCommand,
  getSubmitCommand,
  updateAppConfig,
  updateEasConfig,
} from './app.mjs';

(async () => {
  console.log(`Deploying... 📦⬆️`);

  const app = await getApp();
  const env = await getEnv(true);
  const platform = await getPlatform(true);
  const buildTo = await getBuildTo(env);
  const incrementType = await getIncrementType(env);

  const profile = getEasProfile(env.split('_')[0], buildTo);
  const prebuild = getPrebuildCommand(app, platform);
  const build = getBuildCommand(app, profile, platform, buildTo);
  const submit = getSubmitCommand(app, profile, build);

  updateAppConfig(app, env, incrementType);
  updateEasConfig(app, env, profile);

  spawn(`nx reset && ${prebuild} && ${build} && ${submit}`, {
    stdio: 'inherit',
    shell: true,
  });
})();
