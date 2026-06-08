# meiske-notes

A static personal blog for learning notes, tutorials, and debugging write-ups. Built with [Nuxt 4](https://nuxt.com), [Nuxt Content](https://content.nuxt.com), and a dark editorial design system ([DESIGN.md](DESIGN.md)).

## Requirements

- Node.js 22.13+ (24 recommended)
- [pnpm](https://pnpm.io)

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build (Node server) |
| `pnpm typecheck` | Nuxt/Vue type checking |
| `pnpm test` | Node unit tests for post utilities |
| `pnpm ci` | Typecheck, test, and production build |
| `pnpm generate` | Static site export for GitHub Pages / Netlify |
| `pnpm preview` | Preview production output |
| `pnpm new-post <slug>` | Scaffold a new post in `content/posts/` |

## CI/CD to Vercel

GitHub Actions runs `pnpm typecheck`, `pnpm test`, and `pnpm build` before deployment.
Preview deployments run for pull requests, non-production branch pushes, and manual preview dispatches.
Production deployments run when `main` or `master` is pushed, or when the workflow is manually dispatched with `production`.
`vercel.json` disables Vercel Git auto-deployments so deployments are gated by GitHub Actions.

Add these repository secrets in GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

For Vercel, the app uses `/` as the base URL. Set `NUXT_PUBLIC_SITE_HOST` or
`NUXT_PUBLIC_SITE_URL` in Vercel if you want RSS, sitemap, and canonical URLs to
point at a custom domain.

## Static deployment

Set your public URL (used for RSS, canonical links, and sitemap):

```bash
export NUXT_PUBLIC_SITE_URL=https://godlovesmei.github.io/meiske-notes
pnpm generate
```

Output is written to `.output/public`.

## Writing a post

Create `content/posts/your-slug.md`:

```yaml
---
title: Post title
description: One-line summary for cards and SEO
date: 2026-05-30
category: learn
tags:
  - optional-tag
draft: false
readingTime: 5
---
```

### Frontmatter

| Field | Required | Values |
|-------|----------|--------|
| `title` | yes | string |
| `description` | yes | string |
| `date` | yes | `YYYY-MM-DD` |
| `category` | yes | `learn`, `tutorial`, `debugging` |
| `tags` | no | list of strings |
| `draft` | no | `true` hides from listings and RSS |
| `readingTime` | no | minutes; auto-estimated if omitted |

Draft posts are excluded from the home page, archive, RSS, and search index.

## Project structure

```
app/              # Pages, components, layouts
content/posts/    # Markdown articles
content.config.ts # Collection schema
server/routes/    # RSS and search index API (prerendered)
DESIGN.md         # Visual design tokens
```

## Features

- Category filters (Learn, Tutorial, Debugging)
- Full-text search (`/search`, powered by `/search.json`)
- RSS feed (`/rss.xml`)
- Table of contents on posts
- Related posts, tags, and yearly archive
- Sitemap and SEO meta tags
