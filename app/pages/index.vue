<script setup lang="ts">
import type { PostCategory } from '../../content.config'
import { categoryLabels, categoryGlow, estimateReadingTime } from '~/utils/posts'

const route = useRoute()
const appConfig = useAppConfig()

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

const visiblePosts = computed(() =>
  (posts.value ?? []).filter((post) => post.draft !== true),
)

const pageTitle = computed(() => {
  if (categoryFilter.value) {
    return categoryLabels[categoryFilter.value]
  }
  return appConfig.site.name
})

const heroGlow = computed(() =>
  categoryFilter.value ? categoryGlow[categoryFilter.value] : 'glow-learn',
)

useSeoMeta({
  title: pageTitle,
  description: appConfig.site.tagline,
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-[420px]"
        :class="heroGlow"
        aria-hidden="true"
      />
      <div class="site-container relative">
        <p class="font-favorit text-sm tracking-wide text-mute">
          {{ appConfig.site.tagline }}
        </p>
        <h1
          class="font-display mt-4 max-w-4xl text-4xl leading-none tracking-tight text-ink sm:text-5xl md:text-display-xl"
        >
          <template v-if="categoryFilter">
            {{ categoryLabels[categoryFilter] }}
          </template>
          <template v-else>
            Notes on building<br class="hidden sm:block" />
            and fixing things
          </template>
        </h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-charcoal">
          <template v-if="categoryFilter === 'learn'">
            Concepts I am working through — written to clarify my own thinking.
          </template>
          <template v-else-if="categoryFilter === 'tutorial'">
            Step-by-step guides for tools and workflows I use regularly.
          </template>
          <template v-else-if="categoryFilter === 'debugging'">
            Post-mortems and fixes from things that broke in production or locally.
          </template>
          <template v-else>
            A quiet place for learning notes, tutorials, and debugging write-ups.
            The typography stays out of the way so the content can carry the page.
          </template>
        </p>
      </div>
    </section>

    <section class="site-container pb-section">
      <div
        v-if="visiblePosts.length"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <PostCard
          v-for="post in visiblePosts"
          :key="post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :category="post.category"
          :path="post.path"
          :reading-time="estimateReadingTime(post.body, post.description, post.readingTime)"
        />
      </div>

      <div
        v-else
        class="card-surface mx-auto max-w-lg p-12 text-center"
      >
        <p class="font-medium text-ink">No posts yet</p>
        <p class="mt-2 text-sm text-charcoal">
          Add markdown files to <code class="text-ink">content/posts/</code> to
          publish your first article.
        </p>
      </div>
    </section>
  </div>
</template>
