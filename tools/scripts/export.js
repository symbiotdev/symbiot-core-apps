import { spawn } from 'child_process';
import { getApp, getEnv, getExportCommand, updateAppConfig } from './app.mjs';

(async () => {
  console.log(`Exporting... 🌐⬆️`);

  const app = await getApp();
  const env = await getEnv(true);

  updateAppConfig(app, env);

  spawn(getExportCommand(app), {
    stdio: 'inherit',
    shell: true,
  });
})();
