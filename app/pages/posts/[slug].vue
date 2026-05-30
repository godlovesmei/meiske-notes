<script setup lang="ts">
import { categoryGlow, formatDate } from '~/utils/posts'

const route = useRoute()
const slug = route.params.slug as string

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  queryCollection('posts').path(`/posts/${slug}`).first(),
)

if (!post.value || post.value.draft === true) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const glowClass = computed(() => categoryGlow[post.value!.category])

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogTitle: post.value.title,
  ogDescription: post.value.description,
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
      <div class="site-container relative max-w-prose">
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
        </div>
        <h1
          class="font-display mt-6 text-4xl leading-none tracking-tight text-ink sm:text-5xl"
        >
          {{ post.title }}
        </h1>
        <p class="mt-6 font-favorit text-lg leading-relaxed text-charcoal">
          {{ post.description }}
        </p>
      </div>
    </header>

    <div class="site-container pb-section">
      <div class="card-surface mx-auto max-w-prose p-8 md:p-10">
        <div class="prose-blog">
          <ContentRenderer :value="post" />
        </div>
      </div>
    </div>
  </article>
</template>
