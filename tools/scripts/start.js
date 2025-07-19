import { spawn } from 'child_process';
import {
  getApp,
  getEnv,
  getPlatform,
  getStartCommand,
  updateAppConfig,
} from './app.mjs';

(async () => {
  console.log(`Starting... 🚀🚀`);

  const app = await getApp();
  const env = await getEnv();
  const platform = await getPlatform();

  updateAppConfig(app, env);

  spawn(getStartCommand(app, env, platform), {
    stdio: 'inherit',
    shell: true,
  });
})();
