<script setup lang="ts">
import type { PostCategory } from '../../content.config'

const route = useRoute()
const appConfig = useAppConfig()

const searchResults = ref<any[] | null>(null)

const categoryFilter = computed(() => {
  const value = route.query.category
  if (value === 'learn' || value === 'tutorial' || value === 'debugging') {
    return value as PostCategory
  }
  return null
})

const { data: posts } = await useAsyncData(
  () => `posts-${categoryFilter.value ?? 'all'}`,
  () => {
    let query = queryCollection('posts').order('date', 'DESC')
    if (categoryFilter.value) {
      query = query.where('category', '=', categoryFilter.value)
    }
    return query.all()
  },
  { watch: [categoryFilter] },
)

const visiblePosts = computed(() => {
  if (searchResults.value) {
    return searchResults.value
  }
  return (posts.value ?? []).filter((post) => post.draft !== true)
})

useSeoMeta({
  title: appConfig.site.name,
  description: appConfig.site.tagline,
})
</script>

<template>
  <div>
    <SearchBar @update:results="searchResults = $event" />
    <AppHero v-if="!searchResults" />

    <section class="pb-20">
      <h2 class="mb-6 text-xl font-bold text-ink">
        {{ searchResults ? `Search results (${searchResults.length})` : 'Recent posts' }}
      </h2>
      
      <div
        v-if="visiblePosts.length"
        class="grid gap-6 md:grid-cols-2"
      >
        <PostCard
          v-for="post in visiblePosts"
          :key="post.id || post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :category="post.category"
          :path="post.path"
          :reading-time="post.readingTime"
        />
      </div>
      <div v-else class="py-12 text-center text-body/50">
        No posts found.
      </div>
    </section>
  </div>
</template>
