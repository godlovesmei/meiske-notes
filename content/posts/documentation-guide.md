---
title: Guide to Writing Image-Rich Documentation
description: A reference post showing how to write professional documentation with callouts, captioned images, tables, and code blocks in MeiNotes.
date: 2026-06-09
category: tutorial
tags:
  - documentation
  - guide
  - markdown
draft: false
---

Good documentation tells a story through prose, diagrams, and code examples working together. This guide shows every element available in MeiNotes, so you can write guides that feel as clear as Google's developer docs.

## Images & Captions

Add a caption to any image using the Markdown **title syntax** — the text in quotes after the URL becomes the `<figcaption>`. Click any image to open the full-resolution lightbox.

```markdown
![Alt text describing the image](/path/to/image.png "Figure 1 — Your caption here")
```

The result renders as a centred `<figure>` with a hover zoom indicator. Pressing `Escape` or clicking the overlay closes the lightbox.

## Callout Blocks

Use `::DocCallout` blocks to highlight important information without breaking the prose flow. Four variants are available.

::DocCallout{type="info" title="Note"}
Use this for background context, definitions, or explanations that support the main text but aren't critical to follow along.
::

::DocCallout{type="tip" title="Best Practice"}
Use the Markdown **title** attribute on images, not just `alt`. The `alt` is for screen readers; the `title` becomes the visible caption.
::

::DocCallout{type="warning" title="Watch Out"}
Long captions wrap awkwardly on narrow screens. Keep captions under 120 characters for clean line-wrapping at all viewport widths.
::

::DocCallout{type="danger" title="Breaking Change"}
Nuxt Content v3 uses `queryCollection` instead of `queryContent`. Old blog posts using the v2 API will fail silently.
::

## Code Blocks with Copy

Code windows include a **Copy** button at the top-right. Click it and the button momentarily turns green with a check mark before reverting.

```bash
# Scaffold a new documentation post
pnpm new-post my-guide-slug
```

```typescript
// content.config.ts — add custom schema fields
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: 'page',
      source: 'posts/**/*.md',
      schema: z.object({
        title:       z.string(),
        description: z.string(),
        date:        z.string(),
        category:    z.enum(['learn', 'tutorial', 'debugging']),
        draft:       z.boolean().optional(),
        tags:        z.array(z.string()).optional(),
        readingTime: z.number().optional(),
      }),
    }),
  },
})
```

## Tables

Use standard Markdown table syntax. Headers are rendered in small-caps for a clean documentation look.

| Element | Markdown Syntax | Notes |
| --- | --- | --- |
| Image with caption | `![alt](src "title")` | Title becomes `<figcaption>` |
| Info callout | `::DocCallout{type="info"}` | Blue border |
| Tip callout | `::DocCallout{type="tip"}` | Green border |
| Warning callout | `::DocCallout{type="warning"}` | Orange border |
| Danger callout | `::DocCallout{type="danger"}` | Red border |
| Code with lang | ` ```typescript ` | Displays language label + copy button |

## Blockquotes

Standard Markdown blockquotes render with a blue left-border and a slightly dimmed background, styled like a documentation annotation.

> A good guide answers the question before the reader realises they have it.

## Linking Concepts

Link to other pages in your documentation using standard relative Markdown links. The prose link style includes a subtle underline that deepens on hover:

- [Conceptual post on Promises](/posts/understanding-promises)
- [Nuxt Content Setup walkthrough](/posts/nuxt-content-setup)

---

Use this post as a live reference. Every element you see here is written in plain Markdown with no custom HTML required.
