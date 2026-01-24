import { getAppConfig, getAppSyncPaths } from './utils/app';
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

  const { app, dynamicAppJson, supportDeployPlatforms } = await getAppConfig();

  if (!supportDeployPlatforms.includes(Platform.web)) {
    throw new Error('Web deploy is not supported');
  }

  const env = await selectEnv({ ignoreLocal: true });
  const increment = await selectIncrement({ env });
  const syncPaths = getAppSyncPaths({ app, env });
  const fileWatchers = await Promise.all(syncPaths.map(syncFiles));
  const appJson = await syncAppJson({
    app,
    increment,
    platform: Platform.web,
    dynamic: dynamicAppJson,
  });
  const childProcess = spawn(getExportCommand({ app }), {
    stdio: 'inherit',
    shell: true,
  });
  const reset = () => {
    appJson.reset();

    fileWatchers.forEach((watcher) => watcher.close());
    syncPaths.forEach(({ dest }) => rm(dest, { recursive: true }));

  };

  childProcess.on('close', reset);
  childProcess.on('exit', () => {
    reset();
    console.log(`✅ Exported... 🚀`);
  });
})();
