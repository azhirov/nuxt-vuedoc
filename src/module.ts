import {
  defineNuxtModule,
  createResolver,
  addLayout,
  addComponentsDir,
  extendPages, useNuxt,
} from '@nuxt/kit'

import { existsSync, mkdirSync, promises } from 'node:fs'
import { join } from 'path'
import * as fs from 'fs'
import { glob } from 'glob'
import path from 'path'
import getHash from 'hash-sum'
import slugify from 'slugify'
import MarkdownIt from 'markdown-it'
import { componentPlugin } from '@mdit-vue/plugin-component'
import { sfcPlugin } from '@mdit-vue/plugin-sfc'
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import { rimraf } from 'rimraf';
import lodashTemplate from "lodash.template";

// Module options TypeScript interface definition
export interface ModuleOptions {
  nav: any
  github?: string
  docsDir: string,
  docsBaseUrl: string
}

function createDir(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path);
  }
  return path;
}

function createCacheDir() {
  const nuxt = useNuxt();
  const cacheDir = join(nuxt.options.rootDir, '.vuedoc');
  return createDir(cacheDir);
}

async function addComponentFromTemplate(src: string, componentName: string, options: Record<string, any>) {
  const cacheDir = createCacheDir();
  const source = await promises.readFile(src, 'utf-8');
  console.log(source);
  const compiledTemplate = lodashTemplate(source, {interpolate: /<%=([\s\S]+?)%>/g})({ options });
  createDir(join(cacheDir, 'components'));
  fs.writeFileSync(join(cacheDir, 'components', `${componentName}.vue`), compiledTemplate);
}

function createMarkdownParser() {
  return new MarkdownIt({
    html: true,
  })
  .use(componentPlugin)
  .use(sfcPlugin)
  .use(frontmatterPlugin);
}

interface MdFileInfo {
  srcPath: string
  tmplPath: string
  url: string
  routeName: string
  hash: string
  template: string
  frontmatter: Record<string, string>
}

async function getMdFiles(docsDir: string, docsBaseUrl: string) {
  const resolver = createResolver(import.meta.url);
  const cacheDir = createCacheDir();
  const markdown = createMarkdownParser();

  const mdFiles = await glob.glob('**/*.md', { cwd: docsDir });
  const pagesDir = createDir(resolver.resolve(cacheDir, 'pages'));
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

    const content = fs.readFileSync(srcPath, 'utf-8');
    const env: any = {};
    const tmpl = markdown.render(content, env);

    const script = env.sfcBlocks?.script?.content ?? null;
    let template = env.sfcBlocks?.template?.contentStripped ?? null;
    template = `${env.sfcBlocks?.template?.tagOpen}<div class="vuedoc-md">${template}</div>${env.sfcBlocks?.template?.tagClose}`;
    template = `${template || tmpl}${script || ''}`;
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

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-vuedoc',
    configKey: 'vuedoc'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    nav: {},
    docsDir: 'docs',
    docsBaseUrl: 'docs',
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)
    rimraf.rimrafSync(resolver.resolve(nuxt.options.rootDir, '.vuedoc'));

    const docsDir = resolver.resolve(nuxt.options.srcDir, options.docsDir);
    const mdFiles = await getMdFiles(docsDir, options.docsBaseUrl);
    console.log(mdFiles);

    await addComponentsDir({
      path: resolver.resolve( "./runtime/components"),
      pathPrefix: false,
      extensions: ['vue'],
      watch: true,
    });

    await addComponentFromTemplate(resolver.resolve('./runtime/templates/VuedocSidebar.vue'), 'VuedocSidebar', {
      links: options.nav,
    });
    await addComponentFromTemplate(resolver.resolve('./runtime/templates/VuedocLayoutHeader.vue'), 'VuedocLayoutHeader', {
      github: options.github ?? null,
    });

    const cacheDir = createCacheDir();

    await addComponentsDir({
      path: resolver.resolve(cacheDir, 'components'),
      global: false,
    })

    addLayout({
      src: resolver.resolve('./runtime/layouts/VuedocLayout.vue'),
      filename: 'layouts/VuedocLayout.vue',
    }, 'vuedoc');

    for (const mdObjectsKey in mdFiles) {
      const mdItem = mdFiles[mdObjectsKey];
      console.log(`Generate: ${mdItem.srcPath}`);
      fs.writeFileSync(mdItem.tmplPath, mdItem.template);
    }
    createDir(path.join(cacheDir, 'pages'));
    await addComponentsDir({
      path: resolver.resolve(cacheDir, 'pages'),
      global: false,
    })

    extendPages((pages) => {
      mdFiles.forEach((item) => {
        pages.push({
          path: item.url,
          name: item.routeName,
          component: resolver.resolve('./runtime/components/VuedocPage.vue'),
          props: {
            pageName: `Vuedoc${item.hash.charAt(0).toUpperCase()}${item.hash.slice(1)}`,
            frontmatter: item.frontmatter,
          },
        } as any);
      });
    });

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'))
  }
})
