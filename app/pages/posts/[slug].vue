<script setup lang="ts">
import {
  categoryGlow,
  estimateReadingTime,
  flattenTocLinks,
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
const tocLinks = computed(() => flattenTocLinks(post.value?.toc?.links as never))
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
    .slice(0, 3)
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
  <article v-if="post">
    <header class="relative overflow-hidden pb-12 pt-16 md:pb-16 md:pt-24">
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-[380px]"
        :class="glowClass"
        aria-hidden="true"
      />
      <div class="site-container relative">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1 text-sm font-medium tracking-wide text-charcoal no-underline hover:text-ink"
        >
          <span aria-hidden="true">←</span>
          All posts
        </NuxtLink>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <CategoryBadge :category="post.category" />
          <time class="text-sm text-mute" :datetime="post.date">
            {{ formatDate(post.date) }}
          </time>
          <span class="text-sm text-mute">
            {{ formatReadingTime(readingTime) }}
          </span>
        </div>
        <TagList v-if="post.tags?.length" class="mt-4" :tags="post.tags" />
        <h1
          class="font-display mt-6 max-w-3xl text-4xl leading-none tracking-tight text-ink sm:text-5xl"
        >
          {{ post.title }}
        </h1>
        <p class="mt-6 max-w-2xl font-favorit text-lg leading-relaxed text-charcoal">
          {{ post.description }}
        </p>
      </div>
    </header>

    <div class="site-container pb-section">
      <div class="mx-auto flex max-w-content flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
        <aside
          v-if="tocLinks.length"
          class="lg:sticky lg:top-24 lg:w-56 lg:shrink-0"
        >
          <PostToc :links="tocLinks" />
        </aside>

        <div class="min-w-0 flex-1">
          <div class="card-surface p-8 md:p-10">
            <div class="prose-blog mx-auto max-w-prose">
              <ContentRenderer :value="post" />
            </div>
          </div>

          <RelatedPosts
            v-if="relatedPosts?.length"
            :posts="relatedPosts"
          />
        </div>
      </div>
    </div>
  </article>
</template>
