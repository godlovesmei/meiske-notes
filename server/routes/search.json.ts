import { fetchPublishedPosts, minimarkToPlainText } from '../utils/posts'

export default defineEventHandler(async (event) => {
  const posts = await fetchPublishedPosts(event)

  const index = posts.map((post) => ({
    path: post.path,
    title: post.title,
    description: post.description,
    category: post.category,
    date: post.date,
    tags: post.tags ?? [],
    body: minimarkToPlainText(post.body?.value),
  }))

  setHeader(event, 'content-type', 'application/json; charset=utf-8')
  return index
})
