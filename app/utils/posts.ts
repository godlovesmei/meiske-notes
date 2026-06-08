import type { MinimarkNode, MinimarkText } from '@nuxt/content'
import type { PostCategory } from '../../content.config'

export const categoryLabels: Record<PostCategory, string> = {
  learn: 'Learn',
  tutorial: 'Tutorial',
  debugging: 'Debugging',
}

export const categoryGlow: Record<PostCategory, string> = {
  learn: 'glow-learn',
  tutorial: 'glow-tutorial',
  debugging: 'glow-debugging',
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function postSlugFromPath(path: string) {
  const segment = path.split('/').filter(Boolean).pop()
  return segment ?? ''
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

export function estimateReadingTime(
  body: { value?: MinimarkNode[] } | undefined,
  description?: string,
  explicitMinutes?: number,
) {
  if (explicitMinutes && explicitMinutes > 0) {
    return explicitMinutes
  }
  const text = `${description ?? ''} ${minimarkToPlainText(body?.value)}`.trim()
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export function formatReadingTime(minutes: number) {
  return `${minutes} min read`
}

export function isPublished(post: { draft?: boolean }) {
  return post.draft !== true
}

export type TocLink = {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

export function flattenTocLinks(links: TocLink[] | undefined): TocLink[] {
  if (!links?.length) return []
  const flat: TocLink[] = []
  for (const link of links) {
    flat.push({ id: link.id, text: link.text, depth: link.depth })
    if (link.children?.length) {
      flat.push(...flattenTocLinks(link.children))
    }
  }
  return flat.filter((link) => link.depth >= 2 && link.depth <= 3)
}
