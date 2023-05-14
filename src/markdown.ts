import { createResolver } from '@nuxt/kit'
import { glob } from 'glob'
import path from 'path'
import getHash from 'hash-sum'
import slugify from 'slugify'
import fs from 'fs'
import MarkdownIt from 'markdown-it'
import { componentPlugin } from '@mdit-vue/plugin-component'
import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import { createCacheDir, createDir } from './utils'
import type { MdFileInfo } from './types'

export function createMarkdownParser() {
  return new MarkdownIt({
    html: true,
  })
    .use(componentPlugin)
    .use(sfcPlugin)
    .use(frontmatterPlugin);
}

export function parseMd(srcPath: string) {
  const markdown = createMarkdownParser();
  const content = fs.readFileSync(srcPath, 'utf-8');
  const env: any = {};
  const tmpl = markdown.render(content, env);

  const script = env.sfcBlocks?.script?.content ?? null;
  let template = env.sfcBlocks?.template?.contentStripped ?? null;
  template = `${env.sfcBlocks?.template?.tagOpen}<div class="vuedoc-md">${template}</div>${env.sfcBlocks?.template?.tagClose}`;
  template = `${template || tmpl}${script || ''}`;
  return { template, env };
}

export async function getMdFiles(docsDir: string, docsBaseUrl: string) {
  const resolver = createResolver(import.meta.url);
  const cacheDir = createCacheDir();
  const pagesDir = createDir(resolver.resolve(cacheDir, 'pages'));

  const mdFiles = await glob.glob('**/*.md', { cwd: docsDir });
  return mdFiles.map((mdFile) => {
    const srcPath = path.resolve(docsDir, mdFile);
    const hash = getHash(srcPath);
    const isIndex = (path.basename(srcPath, path.extname(srcPath)) === 'index');

    const relPath = isIndex ? path.relative(docsDir, path.dirname(srcPath)) : path.relative(docsDir, srcPath);
    let url = path.join(path.dirname(relPath), path.basename(relPath, path.extname(relPath))).replace(/\\+/g, '/');
    if (docsBaseUrl && docsBaseUrl !== '/') {
      url = `${docsBaseUrl}/${url}`;
    }
    if (!url.startsWith('/')) {
      url = `/${url}`;
    }
    const routeName = slugify(url.replace(/\//g, '-'), { replacement: '-' });
    const tmplPath = path.join(pagesDir, `vuedoc-${hash}.vue`);
    const { template, env } = parseMd(srcPath);

    return {
      srcPath,
      tmplPath,
      url,
      routeName,
      hash,
      template,
      frontmatter: env.frontmatter,
    } as MdFileInfo;
  });
}
