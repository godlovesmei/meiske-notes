<script setup lang="ts">
import { formatDate, isPublished } from '~/utils/posts'

const { data: posts } = await useAsyncData('archive-posts', () =>
  queryCollection('posts').order('date', 'DESC').all(),
)

const grouped = computed(() => {
  const published = (posts.value ?? []).filter(isPublished)
  const byYear = new Map<string, typeof published>()

  for (const post of published) {
    const year = new Date(post.date).getFullYear().toString()
    const list = byYear.get(year) ?? []
    list.push(post)
    byYear.set(year, list)
  }

  return [...byYear.entries()].sort(([a], [b]) => Number(b) - Number(a))
})

useSeoMeta({
  title: 'Archive',
  description: 'All notes grouped by year.',
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden pb-12 pt-20 md:pt-24">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[320px] glow-learn" aria-hidden="true" />
      <div class="site-container relative">
        <h1 class="font-display text-4xl leading-none tracking-tight text-ink">
          Archive
        </h1>
        <p class="mt-4 max-w-prose text-charcoal">
          Every published note, grouped by year.
        </p>
      </div>
    </section>

    <section class="site-container max-w-prose space-y-12 pb-section">
      <section v-for="[year, yearPosts] in grouped" :key="year">
        <h2 class="font-display text-3xl text-ink">{{ year }}</h2>
        <ul class="mt-6 space-y-4">
          <li
            v-for="post in yearPosts"
            :key="post.path"
            class="hairline-b border-b border-hairline pb-4"
          >
            <NuxtLink :to="post.path" class="group block no-underline">
              <div class="flex flex-wrap items-baseline justify-between gap-2">
                <span class="font-medium text-ink group-hover:text-link">
                  {{ post.title }}
                </span>
                <time class="text-xs text-mute" :datetime="post.date">
                  {{ formatDate(post.date) }}
                </time>
              </div>
              <p class="mt-1 text-sm text-charcoal">{{ post.description }}</p>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </section>
  </div>
</template>
