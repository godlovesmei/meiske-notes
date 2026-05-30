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
    if ('value' in node && typeof (node as MinimarkText).value === 'string') {
      parts.push((node as MinimarkText).value)
    }
    if ('children' in node && Array.isArray(node.children)) {
      parts.push(minimarkToPlainText(node.children as MinimarkNode[]))
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
