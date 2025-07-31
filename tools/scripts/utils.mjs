import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from 'node:fs/promises';
import { join } from 'path';

export const copyFiles = async (src, dest) => {
  const stats = await stat(src);

  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);

    for (const entry of entries) {
      const srcPath = join(src, entry);
      const destPath = join(dest, entry);
      await copyFiles(srcPath, destPath);
    }
  } else {
    await copyFile(src, dest);
  }
};

export const createEnvFile = async (src, dest) => {
  await writeFile(dest, await readFile(src));
};
