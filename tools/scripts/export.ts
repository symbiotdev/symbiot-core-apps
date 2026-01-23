import { getAppSyncPaths, selectApp } from './utils/app';
import { selectEnv } from './utils/env';
import { syncFiles } from './utils/sync-files';
import { spawn } from 'child_process';
import { getExportCommand } from './utils/nx-expo';
import { selectIncrement } from './utils/increment';
import { Platform } from './utils/platform';
import { rm } from 'node:fs/promises';
import { syncAppJson } from './utils/expo-app-json';

(async () => {
  console.log(`Exporting... 🌐⬆️`);

  const app = await selectApp();
  const env = await selectEnv({ ignoreLocal: true });
  const increment = await selectIncrement({ env });
  const syncPaths = getAppSyncPaths({ app, env });
  const fileWatchers = await Promise.all(syncPaths.map(syncFiles));
  const { reset: resetAppJson } = await syncAppJson({
    app,
    increment,
    platform: Platform.web,
  });
  const childProcess = spawn(getExportCommand({ app }), {
    stdio: 'inherit',
    shell: true,
  });

  childProcess.on('exit', () => {
    resetAppJson();

    fileWatchers.forEach((watcher) => watcher.close());
    syncPaths.forEach(({ dest }) => rm(dest, { recursive: true }));

    console.log(`✅ Exported... 🚀`);
  });
})();
