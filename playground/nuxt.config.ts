import path from 'path'

export default defineNuxtConfig({
  modules: ['../src/module'],
  vuedoc: {
    github: 'https://github.com/on-org/on-frontend-components',
    nav: [
      {
        title: 'Home',
        to: '/',
      },
      {
        title: 'Primary button',
        to: '/docs/primary-button',
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
  alias: {
    '@comp': path.resolve(__dirname, './components'),
  },
  app: {
    baseURL: '/nuxt-vuedoc/'
  },
  devtools: { enabled: true }
})
