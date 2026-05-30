import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

const category = z.enum(['learn', 'tutorial', 'debugging'])

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        category,
        draft: z.boolean().optional(),
      }),
    }),
  },
})

export type PostCategory = z.infer<typeof category>
