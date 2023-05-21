import {addComponent, createResolver, resolvePath, useNuxt} from '@nuxt/kit'
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
import type {MdFileInfo, VuedocTocItem} from './types'
import { parseComponent } from 'vue-template-compiler';
import hash_sum from "hash-sum";
import { parse as parseHtml } from 'node-html-parser';
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
      example(arg) {
        console.log('example found: ' + arg);
        return `@example(${arg})`
      },
    })
    .use(frontmatterPlugin);
}

export function createSimpleMarkdownParser() {
  return new MarkdownIt({
    html: false,
  });
}

export async function parseExample(rawTemplate: string) {
  if (!rawTemplate) return '';
  const nuxt = useNuxt();
  return await replaceAsync(rawTemplate, /@example\((.*?)\)/g, async (a, b) => {
    const path = await resolvePath(b, {
      alias: nuxt.options.alias,
    });

    const exampleHash = hash_sum(path);
    const exampleComponentName = `example-${exampleHash.charAt(0).toUpperCase()}${exampleHash.slice(1)}`;
    await addComponent({
      name: exampleComponentName,
      global: false,
      filePath: path,
      isAsync: true,
    } as any);

    const content = fs.readFileSync(path, 'utf-8');
    return `<vuedoc-example source="${encode(content)}"><${exampleComponentName} /></vuedoc-example>`;
  });
}

export async function parseComponentApi(rawTemplate: string) {
  if (!rawTemplate) return '';

  const nuxt = useNuxt();
  const apiMarkdown = createSimpleMarkdownParser();

  return await replaceAsync(rawTemplate, /@api\((.*?)\)/g, async (a, b) => {
    const path = await resolvePath(b, {
      alias: nuxt.options.alias,
    });
    const parsed = await parseVueFile(path);
    parsed.props = parsed.props?.map((item) => ({
      ...item,
      description: apiMarkdown.render(item.description ?? ''),
      defaultValue: item.defaultValue?.value ? {
        ...item.defaultValue,
        value: apiMarkdown.renderInline(item.defaultValue.value),
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
    const props = encode(JSON.stringify(parsed.props));
    const events = encode(JSON.stringify(parsed.events));
    const slots = encode(JSON.stringify(parsed.slots));
    const methods = encode(JSON.stringify(parsed.methods));
    // noinspection VueMissingComponentImportInspection
    return `<VuedocComponentApi :props="${props}" :events="${events}" :slots="${slots}" :methods="${methods}" />`;
  });
}

export async function parseMd(srcPath: string) {
  console.log('PARSE MD CALLED');
  const markdown = createMarkdownParser();
  const content = fs.readFileSync(srcPath, 'utf-8');
  const env: any = {};
  const tmpl = markdown.render(content, env);
  console.log({ srcPath, tmpl, template: env.sfcBlocks?.template });

  const script = env.sfcBlocks?.script?.content ?? null;
  let template = await parseComponentApi(env.sfcBlocks?.template?.contentStripped ?? null);
  template = await parseExample(template);
  env.headers = parseHeaders(template);
  template = `${env.sfcBlocks?.template?.tagOpen}<div class="vuedoc-md">${template}</div>${env.sfcBlocks?.template?.tagClose}`;
  template = `${template || tmpl}${script || ''}`;
  return { template, env };
}

export function parseHeaders(template: string) {
  const parsedHtml = parseHtml(template);
  const vuedocList = parsedHtml.getElementsByTagName('VuedocComponentApi');

  const dict = {
    props: {
      title: 'Props',
      id: 'api-props',
    },
    events: {
      title: 'Events',
      id: 'api-events',
    },
    slots: {
      title: 'Slots',
      id: 'api-slots',
    },
    methods: {
      title: 'Public methods',
      id: 'api-public-methods',
    }
  }
  vuedocList.forEach((el) => {
    const headers: string[] = [];
    ['props', 'events', 'slots', 'methods'].forEach((header) => {
      const info = dict[header as keyof typeof dict];
      if (el.getAttribute(header) || el.getAttribute(`:${header}`)) {
        headers.push(`<h2 id="${info.id}">${info.title}</h2>`);
      }
    })
    el.replaceWith(headers.join(''));
  });
  const h2list = parsedHtml.querySelectorAll('h2[id]');
  return h2list.map((el) => {
    return {
      title: el.textContent,
      id: el.id,
    } as VuedocTocItem
  });
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
      headers: env.headers,
    } as MdFileInfo;
  }));
}
