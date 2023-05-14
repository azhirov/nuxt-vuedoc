import { existsSync, mkdirSync } from 'node:fs'
import { useNuxt } from '@nuxt/kit'
import { join } from 'path'

export function createDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  return path;
}

export function createCacheDir() {
  const nuxt = useNuxt();
  const cacheDir = join(nuxt.options.rootDir, '.vuedoc');
  return createDir(cacheDir);
}
