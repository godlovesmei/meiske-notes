---
title: Setting up a markdown blog with Nuxt Content
description: Collections, frontmatter schemas, and rendering posts with ContentRenderer — the pieces I reach for on every static blog.
date: 2026-05-18
category: tutorial
tags:
  - nuxt
  - markdown
---

Nuxt Content v3 stores parsed markdown in a SQLite-backed collection. You define collections in `content.config.ts`, write files under `content/`, and query them with `queryCollection`.

## Define a collection

```ts
import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        category: z.enum(['learn', 'tutorial', 'debugging']),
      }),
    }),
  },
})
```

The schema validates frontmatter at build time. Typos in `category` fail early instead of at runtime.

## List posts on the home page

```vue
<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('posts').order('date', 'DESC').all(),
)
</script>
```

## Render a single article

```vue
<ContentRenderer :value="post" />
```

Shiki handles syntax highlighting when `content.highlight` is configured in `nuxt.config.ts`.

## Tips

- Keep frontmatter small — move long prose into the body.
- Use `draft: true` during writing and filter drafts in the listing query.
- Prefer explicit `path()` lookups on detail pages over string concatenation when possible.
