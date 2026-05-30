export function usePostStats() {
  const { data: posts } = useAsyncData('posts-stats', () => {
    return queryCollection('posts').all()
  })

  const stats = computed(() => {
    const allPosts = posts.value || []
    
    const categories = {
      learn: allPosts.filter(p => p.category === 'learn').length,
      tutorial: allPosts.filter(p => p.category === 'tutorial').length,
      debugging: allPosts.filter(p => p.category === 'debugging').length,
    }

    const tags = {
      frontend: allPosts.filter(p => p.tags?.includes('frontend')).length,
      backend: allPosts.filter(p => p.tags?.includes('backend')).length,
      ai: allPosts.filter(p => p.tags?.includes('ai')).length,
      fixes: allPosts.filter(p => p.tags?.includes('fixes')).length,
      snippets: allPosts.filter(p => p.tags?.includes('snippets')).length,
    }

    return {
      total: allPosts.length,
      categories,
      tags
    }
  })

  return {
    stats,
    refreshStats: () => refreshNuxtData('posts-stats')
  }
}
