import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  buildModules: ['@nuxt/typescript-build'],
  modules: ['../src/module'],
  vuedoc: {
    github: 'https://github.com/on-org/on-frontend-components',
    nav: [
      {
        title: 'Home',
        to: '/',
      },
      {
        title: 'Link',
        to: '/docs/link',
      },
      {
        title: 'Link 2',
        items: [
          {
            title: 'Sub link',
            to: '/docs/sub-link',
          },
          {
            title: 'Sub link',
            to: '/docs/sub-link',
          },
          {
            title: 'Sub link',
            to: '/docs/sub-link',
          },
          {
            title: 'Sub link',
            to: '/docs/sub-link',
          },
          {
            title: 'Sub link',
            to: '/docs/sub-link',
          },
        ]
      }
    ]
  },
  components: false,
}

export default config
