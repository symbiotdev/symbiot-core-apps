import { spawn } from 'child_process';
import { getApp, getEnv, getExportCommand, mergeAppAssets } from './app.mjs';

(async () => {
  console.log(`Exporting... 🌐⬆️`);

  const app = await getApp();
  const env = await getEnv(true);
  const buildApp = 'service-brand';

  await mergeAppAssets(app, buildApp, env);

  spawn(getExportCommand(buildApp), {
    stdio: 'inherit',
    shell: true,
  });
})();
