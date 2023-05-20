import { createResolver, resolvePath, useNuxt } from '@nuxt/kit'
import { glob } from 'glob'
import path from 'path'
import getHash from 'hash-sum'
import slugify from 'slugify'
import fs from 'fs'
import MarkdownIt from 'markdown-it'
import { componentPlugin } from '@mdit-vue/plugin-component'
import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import anchorPlugin from 'markdown-it-anchor'
import customBlock from 'markdown-it-custom-block';
import { encode } from 'html-entities';
import { createCacheDir, createDir, replaceAsync } from './utils'
import { parse as parseVueFile } from 'vue-docgen-api'
import type { MdFileInfo } from './types'

export function createMarkdownParser() {
  return new MarkdownIt({
    html: true,
  })
    .use(componentPlugin)
    .use(sfcPlugin)
    .use(anchorPlugin)
    .use(customBlock, {
      api(arg) {
        return `@api(${arg})`
      },
    })
    .use(frontmatterPlugin);
}

export function createSimpleMarkdownParser() {
  return new MarkdownIt({
    html: false,
  });
}

export async function parseComponentApi(rawTemplate: string) {
  if (!rawTemplate) return '';

  const nuxt = useNuxt();
  const apiMarkdown = createSimpleMarkdownParser();

  return await replaceAsync(rawTemplate, /@api\((.*?)\)/, async (a, b) => {
    const path = await resolvePath(b, {
      alias: nuxt.options.alias,
    });
    const parsed = await parseVueFile(path);
    parsed.props = parsed.props?.map((item) => ({
      ...item,
      description: apiMarkdown.render(item.description ?? ''),
      defaultValue: item.defaultValue?.value ? {
        ...item.defaultValue,
        value: apiMarkdown.render(item.defaultValue.value),
      } : item.defaultValue,
    })).filter((item) => !item.tags?.ignore);
    parsed.events = parsed.events?.map((event) => ({
      ...event,
      description: event.description ? apiMarkdown.render(event.description) : event.description,
    }));
    parsed.slots = parsed.slots?.map((slot) => ({
      ...slot,
      description: slot.description ? apiMarkdown.render(slot.description) : slot.description,
    }));
    parsed.methods = parsed.methods?.map((method) => ({
      ...method,
      description: method.description ? apiMarkdown.render(method.description) : method.description,
    }));
    const str = encode(JSON.stringify(parsed));
    // noinspection VueMissingComponentImportInspection
    return `<VuedocComponentApi :value="${str}" />`;
  });
}

export async function parseMd(srcPath: string) {
  const markdown = createMarkdownParser();
  const content = fs.readFileSync(srcPath, 'utf-8');
  const env: any = {};
  const tmpl = markdown.render(content, env);

  const script = env.sfcBlocks?.script?.content ?? null;
  let template = await parseComponentApi(env.sfcBlocks?.template?.contentStripped ?? null);
  template = `${env.sfcBlocks?.template?.tagOpen}<div class="vuedoc-md">${template}</div>${env.sfcBlocks?.template?.tagClose}`;
  template = `${template || tmpl}${script || ''}`;
  return { template, env };
}

export async function getMdFiles(docsDir: string, docsBaseUrl: string) {
  const resolver = createResolver(import.meta.url);
  const cacheDir = createCacheDir();
  const pagesDir = createDir(resolver.resolve(cacheDir, 'pages'));

  const mdFiles = await glob.glob('**/*.md', { cwd: docsDir });
  return await Promise.all(mdFiles.map(async (mdFile) => {
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
    const { template, env } = await parseMd(srcPath);

    return {
      srcPath,
      tmplPath,
      url,
      routeName,
      hash,
      template,
      frontmatter: env.frontmatter,
    } as MdFileInfo;
  }));
}
