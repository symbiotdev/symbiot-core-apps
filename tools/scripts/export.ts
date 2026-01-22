import { realAppName, selectApp } from './utils/app';
import { selectEnv } from './utils/env';
import { syncAssets } from './utils/assets';
import { spawn } from 'child_process';
import { getExportCommand } from './utils/nx-expo';

(async () => {
  console.log(`Exporting... 🌐⬆️`);

  const app = await selectApp();
  const env = await selectEnv({ ignoreLocal: true });
  const appName = realAppName[app];

  await syncAssets({ app, env });

  const childProcess = spawn(getExportCommand({ appName }), {
    stdio: 'inherit',
    shell: true,
  });

  childProcess.on('close', () => {
    console.log(`✅ Exported... 🚀`);
  });
})();
