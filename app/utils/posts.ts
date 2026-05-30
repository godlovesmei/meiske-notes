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

export function postPath(slug: string) {
  return `/posts/${slug}`
}

export function postSlugFromPath(path: string) {
  const segment = path.split('/').filter(Boolean).pop()
  return segment ?? ''
}
