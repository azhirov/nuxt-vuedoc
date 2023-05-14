import {
  defineNuxtModule,
  createResolver,
  addLayout,
  addComponentsDir,
  extendPages,
} from '@nuxt/kit'

import { promises } from 'node:fs'
import { join } from 'path'
import * as fs from 'fs'
import { rimraf } from 'rimraf';
import lodashTemplate from "lodash.template";
import { createCacheDir, createDir } from './utils'
import { getMdFiles } from './markdown'
import { ModuleOptions } from './types'

async function addComponentFromTemplate(src: string, componentName: string, options: Record<string, any>) {
  const cacheDir = createCacheDir();
  const source = await promises.readFile(src, 'utf-8');
  console.log(source);
  const compiledTemplate = lodashTemplate(source, {interpolate: /<%=([\s\S]+?)%>/g})({ options });
  createDir(join(cacheDir, 'components'));
  fs.writeFileSync(join(cacheDir, 'components', `${componentName}.vue`), compiledTemplate);
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
    rimraf.rimrafSync(resolver.resolve(nuxt.options.rootDir, '.vuedoc'));

    const docsDir = resolver.resolve(nuxt.options.srcDir, options.docsDir);
    const cacheDir = createCacheDir();
    const mdFiles = await getMdFiles(docsDir, options.docsBaseUrl);

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
      github: options.github ?? null,
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
    }, 'vuedoc');

    for (const mdObjectsKey in mdFiles) {
      const mdItem = mdFiles[mdObjectsKey];
      fs.writeFileSync(mdItem.tmplPath, mdItem.template);
    }

    await addComponentsDir({
      path: resolver.resolve(cacheDir, 'pages'),
      global: false,
      extensions: ['vue'],
      watch: true,
    });

    extendPages((pages) => {
      mdFiles.forEach((item) => {
        pages.push({
          path: item.url,
          name: item.routeName,
          /* Nuxt 2 property */
          component: resolver.resolve('./runtime/components/VuedocPage.vue'),
          props: {
            pageName: `Vuedoc${item.hash.charAt(0).toUpperCase()}${item.hash.slice(1)}`,
            frontmatter: item.frontmatter,
          },
        } as any);
      });
    });
  }
})
