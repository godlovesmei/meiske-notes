import type { H3Event } from 'h3'
import type { MinimarkNode, MinimarkText } from '@nuxt/content'

export type PostRecord = {
  path: string
  title: string
  description: string
  date: string
  category: string
  draft?: boolean
  tags?: string[]
  body?: { value?: MinimarkNode[] }
  toc?: { links?: { id: string; text: string; depth: number }[] }
}

export function isPublished(post: PostRecord) {
  return post.draft !== true
}

export async function fetchPublishedPosts(event: H3Event) {
  const { queryCollection } = await import('@nuxt/content/server')
  const posts = await queryCollection(event, 'posts').order('date', 'DESC').all()
  return posts.filter(isPublished) as PostRecord[]
}

export function minimarkToPlainText(nodes: MinimarkNode[] | undefined): string {
  if (!nodes?.length) return ''

  const parts: string[] = []
  for (const node of nodes) {
    if (typeof node === 'string') {
      parts.push(node)
      continue
    }
    if (typeof node === 'object' && node && 'value' in node) {
      const value = (node as { value?: unknown }).value
      if (typeof value === 'string') {
        parts.push(value)
      }
    }
    if (typeof node === 'object' && node && 'children' in node) {
      const children = (node as { children?: MinimarkNode[] }).children
      if (Array.isArray(children)) {
        parts.push(minimarkToPlainText(children))
      }
    }
  }
  return parts.join(' ')
}

export function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
