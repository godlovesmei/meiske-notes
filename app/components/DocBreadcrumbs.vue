<script setup lang="ts">
import { categoryLabels } from '~/utils/posts'
import type { PostCategory } from '../../content.config'

const props = defineProps<{
  category?: string
  title: string
}>()

const categoryLabel = computed(() => {
  if (!props.category) return ''
  return categoryLabels[props.category as PostCategory] || props.category
})

const categoryUrl = computed(() => {
  if (!props.category) return ''
  return `/?category=${props.category}`
})
</script>

<template>
  <nav class="flex items-center gap-2 font-favorit text-xs text-mute mb-6" aria-label="Breadcrumb">
    <NuxtLink
      to="/"
      class="hover:text-ink transition-colors no-underline flex items-center gap-1"
    >
      Home
    </NuxtLink>
    
    <template v-if="categoryLabel">
      <span class="text-body/30" aria-hidden="true">/</span>
      <NuxtLink
        :to="categoryUrl"
        class="hover:text-ink transition-colors no-underline capitalize"
      >
        {{ categoryLabel }}
      </NuxtLink>
    </template>

    <span class="text-body/30" aria-hidden="true">/</span>
    <span class="text-charcoal truncate max-w-[200px] sm:max-w-[300px]" aria-current="page">
      {{ title }}
    </span>
  </nav>
</template>
