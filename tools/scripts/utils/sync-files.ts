import { copyFile, cp, mkdir, rm } from 'node:fs/promises';
import chokidar from 'chokidar';

export const syncFiles = async ({
  src,
  dest,
}: {
  src: string;
  dest: string;
}) => {
  await cp(src, dest, { recursive: true });

  const watcher = chokidar.watch(src);
  const sync = async ({
    path,
    type,
  }: {
    path: string;
    type: 'copyFile' | 'removePath' | 'addDir';
  }) => {
    const appPath = path.replace(src, dest);

    if (type === 'copyFile') {
      await copyFile(path, appPath);
    } else if (type === 'removePath') {
      await rm(appPath, { recursive: true });
    } else if (type === 'addDir') {
      await mkdir(appPath, { recursive: true });
    }
  };

  watcher
    .on('add', (path) => sync({ path, type: 'copyFile' }))
    .on('change', (path) => sync({ path, type: 'copyFile' }))
    .on('unlink', (path) => sync({ path, type: 'removePath' }))
    .on('addDir', (path) => sync({ path, type: 'addDir' }))
    .on('unlinkDir', (path) => sync({ path, type: 'removePath' }));

  return watcher;
};
