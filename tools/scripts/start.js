import {
  getApp,
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
  const platform = await getPlatform();
  const buildApp = 'service-based-business';

  await mergeAppAssets(app, buildApp, env);

  spawn(getStartCommand(buildApp, env, platform), {
    stdio: 'inherit',
    shell: true,
  });
})();
