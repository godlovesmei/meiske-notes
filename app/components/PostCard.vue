<script setup lang="ts">
import type { PostCategory } from '../../content.config'
import { categoryGlow, formatDate, formatReadingTime } from '~/utils/posts'

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    date: string
    category: PostCategory
    path: string
    readingTime?: number
    compact?: boolean
  }>(),
  { compact: false },
)

const glowClass = computed(() => categoryGlow[props.category])
</script>

<template>
  <article
    class="card-surface group relative overflow-hidden transition-colors hover:border-ink/20"
    :class="compact ? '' : ''"
  >
    <div
      v-if="!compact"
      class="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-60 transition-opacity group-hover:opacity-100"
      :class="glowClass"
      aria-hidden="true"
    />
    <NuxtLink
      :to="path"
      class="relative block no-underline"
      :class="compact ? 'p-5' : 'p-8'"
    >
      <div class="flex flex-wrap items-center gap-3">
        <CategoryBadge :category="category" />
        <time class="text-xs text-mute" :datetime="date">
          {{ formatDate(date) }}
        </time>
        <span v-if="readingTime" class="text-xs text-mute">
          {{ formatReadingTime(readingTime) }}
        </span>
      </div>
      <h2
        class="mt-4 font-sans font-medium tracking-tight text-ink"
        :class="compact ? 'text-base' : 'text-xl'"
      >
        {{ title }}
      </h2>
      <p
        class="mt-3 line-clamp-2 leading-relaxed text-charcoal"
        :class="compact ? 'text-xs' : 'text-sm'"
      >
        {{ description }}
      </p>
      <span
        v-if="!compact"
        class="mt-6 inline-flex items-center gap-1 text-sm font-medium tracking-wide text-link"
      >
        Read
        <span aria-hidden="true">→</span>
      </span>
    </NuxtLink>
  </article>
</template>
