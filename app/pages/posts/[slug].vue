<script setup lang="ts">
import {
  categoryGlow,
  estimateReadingTime,
  formatDate,
  formatReadingTime,
  isPublished,
} from '~/utils/posts'

const route = useRoute()
const config = useRuntimeConfig()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('posts').path(`/posts/${slug}`).first(),
)

if (!post.value || !isPublished(post.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const glowClass = computed(() => categoryGlow[post.value!.category])
const readingTime = computed(() =>
  estimateReadingTime(
    post.value?.body,
    post.value?.description,
    post.value?.readingTime,
  ),
)
const canonicalUrl = computed(
  () => `${config.public.siteUrl}${post.value!.path}`,
)

const { data: relatedPosts } = await useAsyncData(`related-${slug}`, async () => {
  const all = await queryCollection('posts').all()
  const current = all.find((entry) => entry.path === `/posts/${slug}`)
  if (!current || !isPublished(current)) return []

  const currentTags = new Set(current.tags ?? [])

  return all
    .filter((entry) => isPublished(entry) && entry.path !== current.path)
    .map((entry) => {
      const sharedTags = (entry.tags ?? []).filter((tag) => currentTags.has(tag)).length
      const sameCategory = entry.category === current.category ? 1 : 0
      return { entry, score: sharedTags * 2 + sameCategory }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2) // Slice to 2 to make related list more compact in the doc view
    .map(({ entry }) => entry)
})

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  ogType: 'article',
  ogUrl: canonicalUrl,
  twitterCard: 'summary',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <article v-if="post" class="relative max-w-4xl mx-auto w-full">
    <!-- Glow Backdrop header -->
    <header class="relative overflow-hidden pb-8 pt-4">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-[280px] opacity-75"
        :class="glowClass"
        aria-hidden="true"
      />
      <div class="relative">
        <!-- Breadcrumbs instead of raw back link -->
        <DocBreadcrumbs :category="post.category" :title="post.title" />

        <div class="flex flex-wrap items-center gap-3">
          <CategoryBadge :category="post.category" />
          <time class="text-xs text-mute" :datetime="post.date">
            {{ formatDate(post.date) }}
          </time>
          <span class="text-xs text-mute border-l border-hairline-strong pl-3">
            {{ formatReadingTime(readingTime) }}
          </span>
        </div>

        <h1
          class="font-sans mt-4 text-3xl leading-tight font-bold tracking-tight text-ink sm:text-4xl"
        >
          {{ post.title }}
        </h1>
        <p class="mt-4 font-favorit text-base leading-relaxed text-charcoal max-w-3xl">
          {{ post.description }}
        </p>

        <TagList v-if="post.tags?.length" class="mt-4" :tags="post.tags" />
      </div>
    </header>

    <!-- Content Pane -->
    <div class="relative mt-4">
      <div class="card-surface p-6 md:p-8">
        <div class="prose-blog mx-auto max-w-none">
          <ContentRenderer :value="post" />
        </div>

        <!-- Was this page helpful feedback widget -->
        <DocFeedback />
      </div>

      <!-- Related articles stack -->
      <RelatedPosts
        v-if="relatedPosts?.length"
        :posts="relatedPosts"
        class="mt-8"
      />
    </div>
  </article>
</template>

