import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const categoryValues = ['learn', 'tutorial', 'debugging'] as const
const category = z.enum(categoryValues)

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
        tags: z.array(z.string()).optional(),
        readingTime: z.number().optional(),
      }),
    }),
  },
})

export type PostCategory = (typeof categoryValues)[number]
