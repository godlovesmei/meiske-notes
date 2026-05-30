// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/tailwindcss', '@nuxt/content', '@nuxt/fonts'],

  css: ['~/assets/css/main.css'],

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
  },

  app: {
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
    },
  },
})
