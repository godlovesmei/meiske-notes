import { defineNuxtModule } from '@nuxt/kit'
import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'

export default defineNuxtModule({
  meta: { name: 'prerender-posts' },
  setup(_options, nuxt) {
    nuxt.hook('nitro:config', async (nitroConfig) => {
      const postsDir = join(nuxt.options.rootDir, 'content/posts')
      const files = await readdir(postsDir).catch(() => [] as string[])

      const postRoutes = files
        .filter((file) => file.endsWith('.md'))
        .map((file) => `/posts/${file.replace(/\.md$/, '')}`)

      const tagRoutes: string[] = []
      for (const file of files.filter((f) => f.endsWith('.md'))) {
        const raw = await readFile(join(postsDir, file), 'utf-8')
        const match = raw.match(/^tags:\s*\n((?:\s+-\s+.+\n?)+)/m)
        if (!match) continue
        const tags = [...match[1].matchAll(/-\s+(.+)/g)].map((m) => m[1]?.trim())
        for (const tag of tags) {
          if (tag) tagRoutes.push(`/tags/${encodeURIComponent(tag)}`)
        }
      }

      const routes = [
        '/',
        '/about',
        '/search',
        '/archive',
        '/rss.xml',
        '/search.json',
        ...postRoutes,
        ...tagRoutes,
      ]

      nitroConfig.prerender = nitroConfig.prerender || {}
      const existing = nitroConfig.prerender.routes ?? []
      nitroConfig.prerender.routes = [...new Set([...existing, ...routes])]
    })
  },
})
