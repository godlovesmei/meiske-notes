<script setup lang="ts">
import type { PostCategory } from '../../content.config'
import { categoryGlow, formatDate } from '~/utils/posts'

const props = defineProps<{
  title: string
  description: string
  date: string
  category: PostCategory
  path: string
}>()

const glowClass = computed(() => categoryGlow[props.category])
</script>

<template>
  <article class="card-surface group relative overflow-hidden transition-colors hover:border-ink/20">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-60 transition-opacity group-hover:opacity-100"
      :class="glowClass"
      aria-hidden="true"
    />
    <NuxtLink :to="path" class="relative block p-8 no-underline">
      <div class="flex flex-wrap items-center gap-3">
        <CategoryBadge :category="category" />
        <time class="text-xs text-mute" :datetime="date">
          {{ formatDate(date) }}
        </time>
      </div>
      <h2 class="mt-4 font-sans text-xl font-medium tracking-tight text-ink">
        {{ title }}
      </h2>
      <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-charcoal">
        {{ description }}
      </p>
      <span class="mt-6 inline-flex items-center gap-1 text-sm font-medium tracking-wide text-link">
        Read
        <span aria-hidden="true">→</span>
      </span>
    </NuxtLink>
  </article>
</template>
