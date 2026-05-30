<script setup lang="ts">
defineProps<{
  tags: string[]
}>()
</script>

<template>
  <ul v-if="tags.length" class="flex flex-wrap gap-2">
    <li v-for="tag in tags" :key="tag">
      <NuxtLink
        :to="`/tags/${encodeURIComponent(tag)}`"
        class="badge-pill no-underline transition-colors hover:text-ink"
      >
        {{ tag }}
      </NuxtLink>
    </li>
  </ul>
</template>
