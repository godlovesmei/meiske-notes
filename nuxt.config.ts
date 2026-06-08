// https://nuxt.com/docs/api/configuration/nuxt-config
function normalizeHost(host: string | undefined) {
  if (!host) return undefined
  const trimmed = host.replace(/\/$/, '')
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
}

const vercelHost = normalizeHost(
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL,
)
const siteHost =
  process.env.NUXT_PUBLIC_SITE_HOST || vercelHost || 'https://godlovesmei.github.io'
const baseURL = process.env.NUXT_APP_BASE_URL || (vercelHost ? '/' : '/meiske-notes/')
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
    name: 'MeiNotes',
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
  },

  fonts: {
    families: [
      { name: 'Playfair Display', provider: 'google' },
      { name: 'Inter', provider: 'google' },
      { name: 'JetBrains Mono', provider: 'google' },
    ],
  },

  content: {
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
      titleTemplate: '%s · MeiNotes',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Tutorials, debugging stories, and things picked up along the way.',
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
