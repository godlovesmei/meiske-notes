// https://nuxt.com/docs/api/configuration/nuxt-config
const siteHost = process.env.NUXT_PUBLIC_SITE_HOST || 'https://godlovesmei.github.io'
const baseURL = process.env.NUXT_APP_BASE_URL || '/meiske-notes/'
const siteUrl =
  process.env.NUXT_PUBLIC_SITE_URL ||
  `${siteHost}${baseURL.replace(/\/$/, '')}`

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxt/fonts',
    '@nuxtjs/sitemap',
    './modules/prerender-posts',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  site: {
    url: siteHost,
    name: 'Notes',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  fonts: {
    families: [
      { name: 'Instrument Serif', provider: 'google' },
      { name: 'Inter Tight', provider: 'google' },
      { name: 'Inter', provider: 'google' },
      { name: 'Geist Mono', provider: 'google' },
    ],
  },

  content: {
    highlight: {
      theme: {
        default: 'github-dark',
        dark: 'github-dark',
      },
    },
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3,
        },
      },
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [
        '/',
        '/about',
        '/search',
        '/archive',
        '/rss.xml',
        '/search.json',
      ],
    },
  },

  app: {
    baseURL,
    head: {
      titleTemplate: '%s · Notes',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Notes on learning, tutorials, and debugging.',
        },
      ],
      link: [
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Notes RSS',
          href: '/rss.xml',
        },
      ],
    },
  },
})
