import { cp, mkdir, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const sourceDir = resolve('dist/tasks-app/browser');
const targetDir = resolve('www');

async function copyDirectory(source, target) {
  await mkdir(target, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = resolve(source, entry.name);
    const targetPath = resolve(target, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(sourcePath, targetPath);
    } else {
      await cp(sourcePath, targetPath);
    }
  }
}

await copyDirectory(sourceDir, targetDir);
