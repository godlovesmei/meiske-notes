<script setup lang="ts">
import type { PostCategory } from '../../content.config'

defineProps<{
  posts: {
    path: string
    title: string
    description: string
    date: string
    category: PostCategory
  }[]
}>()
</script>

<template>
  <section v-if="posts.length" class="mt-16">
    <h2 class="text-sm font-medium uppercase tracking-wider text-mute">
      Related
    </h2>
    <ul class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="post in posts" :key="post.path">
        <PostCard
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :category="post.category"
          :path="post.path"
          compact
        />
      </li>
    </ul>
  </section>
</template>
