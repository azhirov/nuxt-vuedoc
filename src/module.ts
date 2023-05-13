import {
  defineNuxtModule,
  createResolver,
  addLayout,
  addComponentsDir,
  addComponent, addTemplate,
} from '@nuxt/kit'

import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'path'
import * as fs from 'fs'

// Module options TypeScript interface definition
export interface ModuleOptions {
  nav: any
  github?: string
}

async function addComponentFromTemplate(src: string, componentName: string, options: Record<string, any>) {
  if (!existsSync(join(__dirname, '.cache'))) {
    mkdirSync(join(__dirname, '.cache'));
  }

  const template = addTemplate({
    src,
    filename: join(__dirname, '.cache', 'components', `${componentName}.vue`),
    options,
  })
  await addComponent({
    name: componentName,
    filePath: template.dst,
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
  },
  async setup (options, nuxt) {
    const resolver = createResolver(import.meta.url)

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

    addLayout({
      src: resolver.resolve('./runtime/layouts/VuedocLayout.vue'),
      filename: 'layouts/VuedocLayout.vue',
    }, 'vuedoc');

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'))
  }
})
