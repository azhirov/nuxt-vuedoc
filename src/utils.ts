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

export async function replaceAsync(str: string, regex: RegExp, asyncFn: (match: string, ...args: string[]) => Promise<any>) {
  const promises: Promise<string>[] = [];
  str.replace(regex, (match, ...args: string[]): any => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift() ?? '');
}
