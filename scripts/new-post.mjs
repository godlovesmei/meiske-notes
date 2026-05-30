import { writeFile, access } from 'node:fs/promises'
import { join } from 'node:path'

const slug = process.argv[2]

if (!slug) {
  console.error('Usage: pnpm new-post <slug>')
  process.exit(1)
}

if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('Slug must be lowercase letters, numbers, and hyphens.')
  process.exit(1)
}

const filePath = join(process.cwd(), 'content/posts', `${slug}.md`)

try {
  await access(filePath)
  console.error(`Post already exists: ${filePath}`)
  process.exit(1)
} catch {
  // file does not exist
}

const today = new Date().toISOString().slice(0, 10)
const title = slug
  .split('-')
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(' ')

const template = `---
title: ${title}
description: Short summary for cards and SEO.
date: ${today}
category: learn
tags: []
draft: true
---

Write your note here.
`

await writeFile(filePath, template, 'utf-8')
console.log(`Created ${filePath}`)
