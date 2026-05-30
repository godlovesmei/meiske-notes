<script setup lang="ts">
import type { PostCategory } from '../../content.config'
import { categoryLabels } from '~/utils/posts'

defineProps<{
  category: PostCategory
}>()
</script>

<template>
  <span class="badge-pill font-favorit tracking-wide">
    {{ categoryLabels[category] }}
  </span>
</template>
