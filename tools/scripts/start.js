import {
  getApp,
  getBuildType,
  getEnv,
  getPlatform,
  getStartCommand,
  mergeAppAssets,
} from './app.mjs';
import { spawn } from 'child_process';

(async () => {
  console.log(`Starting... 🚀🚀`);

  const app = await getApp();
  const env = await getEnv();
  const buildType = env === 'production' ? await getBuildType() : 'livereload';
  const platform = await getPlatform();

  const buildApp = 'service-based-business';

  await mergeAppAssets(app, buildApp, env);

  const startCommand = getStartCommand(buildApp, buildType, env, platform);

  spawn(startCommand, {
    stdio: 'inherit',
    shell: true,
  });

  console.log('[command]: ', startCommand);
})();
