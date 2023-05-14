import type { NuxtConfig } from '@nuxt/types'
import path from 'path'

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
        title: 'Hello',
        to: '/docs/hello',
      },
      {
        title: 'Group 1',
        items: [
          {
            title: 'Group index',
            to: '/docs/group1',
          },
          {
            title: 'Group page',
            to: '/docs/group1/group-page',
          },
        ]
      }
    ]
  },
  components: false,
  alias: {
    '@comp': path.resolve(__dirname, './components'),
  }
}

export default config
