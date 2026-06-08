import { queryCollection } from '@nuxt/content/server'

export default defineSitemapEventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts').all()

  const staticPages = ['/', '/about', '/search', '/archive'].map((loc) =>
    asSitemapUrl({ loc }),
  )

  const postPages = posts
    .filter((post) => post.draft !== true)
    .map((post) =>
      asSitemapUrl({
        loc: post.path,
        lastmod: post.date,
      }),
    )

  const tagSet = new Set<string>()
  for (const post of posts) {
    if (post.draft === true || !post.tags) continue
    for (const tag of post.tags) tagSet.add(tag)
  }

  const tagPages = [...tagSet].map((tag) =>
    asSitemapUrl({ loc: `/tags/${encodeURIComponent(tag)}` }),
  )

  return [...staticPages, ...postPages, ...tagPages]
})
