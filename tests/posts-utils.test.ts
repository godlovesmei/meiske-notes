import assert from 'node:assert/strict'
import test from 'node:test'

import {
  estimateReadingTime,
  flattenTocLinks,
  formatDate,
  formatReadingTime,
  isPublished as isAppPostPublished,
  minimarkToPlainText as appMinimarkToPlainText,
  postSlugFromPath,
} from '../app/utils/posts.ts'
import {
  escapeXml,
  isPublished as isServerPostPublished,
  minimarkToPlainText as serverMinimarkToPlainText,
} from '../server/utils/posts.ts'

test('formats public post metadata consistently', () => {
  assert.equal(formatDate('2026-06-09'), 'June 9, 2026')
  assert.equal(formatReadingTime(4), '4 min read')
  assert.equal(postSlugFromPath('/posts/install-laravel-13-livewire'), 'install-laravel-13-livewire')
  assert.equal(postSlugFromPath('/posts/nuxt-content-setup/'), 'nuxt-content-setup')
})

test('detects published and draft posts', () => {
  assert.equal(isAppPostPublished({}), true)
  assert.equal(isAppPostPublished({ draft: false }), true)
  assert.equal(isAppPostPublished({ draft: true }), false)

  assert.equal(
    isServerPostPublished({
      path: '/posts/draft',
      title: 'Draft',
      description: 'Hidden',
      date: '2026-06-09',
      category: 'learn',
      draft: true,
    }),
    false,
  )
})

test('flattens minimark content into searchable text', () => {
  const body = [
    'Intro',
    { value: 'value node' },
    {
      children: [
        'nested',
        { value: 'child value' },
      ],
    },
  ]

  assert.equal(appMinimarkToPlainText(body), 'Intro value node nested child value')
  assert.equal(serverMinimarkToPlainText(body), 'Intro value node nested child value')
})

test('estimates reading time from explicit or derived content', () => {
  assert.equal(estimateReadingTime(undefined, 'short description', 7), 7)
  assert.equal(estimateReadingTime(undefined, 'short description', 0), 1)

  const words = Array.from({ length: 201 }, (_, index) => `word${index}`)
  assert.equal(estimateReadingTime({ value: [words.join(' ')] }), 2)
})

test('flattens table of contents links at supported heading depths', () => {
  const flat = flattenTocLinks([
    {
      id: 'intro',
      text: 'Intro',
      depth: 1,
      children: [
        { id: 'setup', text: 'Setup', depth: 2 },
        { id: 'details', text: 'Details', depth: 3 },
        { id: 'too-deep', text: 'Too deep', depth: 4 },
      ],
    },
  ])

  assert.deepEqual(flat, [
    { id: 'setup', text: 'Setup', depth: 2 },
    { id: 'details', text: 'Details', depth: 3 },
  ])
})

test('escapes rss xml-sensitive characters', () => {
  assert.equal(
    escapeXml(`A&B < "quoted" and 'single' >`),
    'A&amp;B &lt; &quot;quoted&quot; and &apos;single&apos; &gt;',
  )
})
