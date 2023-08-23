import {
  defineNuxtModule,
  createResolver,
  addLayout,
  addComponentsDir,
  extendPages,
} from '@nuxt/kit'

import { promises, writeFileSync, rmSync } from 'node:fs'
import path from 'path'
import lodashTemplate from "lodash.template";
import { createCacheDir, createDir } from './utils'
import { getMdFiles } from './markdown'
import { ModuleOptions } from './types'

async function addComponentFromTemplate(src: string, componentName: string, options: Record<string, any>) {
  const cacheDir = createCacheDir();
  const source = await promises.readFile(src, 'utf-8');
  const compiledTemplate = lodashTemplate(source, {interpolate: /<%=([\s\S]+?)%>/g})({ options });
  createDir(path.join(cacheDir, 'components'));
  writeFileSync(path.join(cacheDir, 'components', `${componentName}.vue`), compiledTemplate);
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-vuedoc',
    configKey: 'vuedoc'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    nav: [],
    docsDir: 'docs',
    docsBaseUrl: 'docs',
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)
    rmSync(resolver.resolve(nuxt.options.rootDir, '.vuedoc'), { recursive: true, force: true });

    const docsDir = resolver.resolve(nuxt.options.srcDir, options.docsDir);
    const cacheDir = createCacheDir();
    const mdFiles = await getMdFiles(docsDir, options.docsBaseUrl);

    // add watcher
    nuxt.hook('build:before', () => {
      (nuxt.options as any).watch = (nuxt.options as any).watch || [];
      const docsRelativePath = path.relative(nuxt.options.srcDir, docsDir);
      (nuxt.options as any).watch.push(docsRelativePath);
    })

    await addComponentsDir({
      path: resolver.resolve( "./runtime/components"),
      pathPrefix: false,
      extensions: ['vue'],
      watch: true,
      global: false,
    });

    await addComponentFromTemplate(resolver.resolve('./runtime/templates/VuedocSidebar.vue'), 'VuedocSidebar', {
      links: options.nav,
    });
    await addComponentFromTemplate(resolver.resolve('./runtime/templates/VuedocLayoutHeader.vue'), 'VuedocLayoutHeader', {
      github: options.github || '',
    });

    await addComponentsDir({
      path: resolver.resolve(cacheDir, 'components'),
      extensions: ['vue'],
      watch: true,
      global: false,
    })

    addLayout({
      src: resolver.resolve('./runtime/layouts/VuedocLayout.vue'),
      filename: 'layouts/VuedocLayout.vue',
      write: true,
    }, 'vuedoc');

    for (const mdObjectsKey in mdFiles) {
      const mdItem = mdFiles[mdObjectsKey];
      writeFileSync(mdItem.tmplPath, mdItem.template);
    }

    await addComponentsDir({
      path: resolver.resolve(cacheDir, 'pages'),
      global: true,
      extensions: ['vue'],
      watch: true,

    });

    extendPages((pages) => {
      mdFiles.forEach((item) => {
        pages.push({
          path: item.url,
          name: item.routeName,
          file: resolver.resolve('./runtime/components/VuedocPage.vue'),
          props: {
            pageName: `Vuedoc${item.hash.charAt(0).toUpperCase()}${item.hash.slice(1)}`,
            frontmatter: item.frontmatter,
            headers: item.headers,
          },
        } as any);
      });
    });
  }
})
