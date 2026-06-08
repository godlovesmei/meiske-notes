<script setup lang="ts">
const route = useRoute()
const tag = decodeURIComponent(route.params.tag as string)

const { data: posts } = await useAsyncData(`tag-${tag}`, () =>
  queryCollection('posts').order('date', 'DESC').all(),
)

const tagged = computed(() =>
  (posts.value ?? []).filter(
    (post) => post.draft !== true && (post.tags ?? []).includes(tag),
  ),
)

useSeoMeta({
  title: `Tag: ${tag}`,
  description: `Posts tagged with ${tag}.`,
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden pb-12 pt-20 md:pt-24">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[320px] glow-learn" aria-hidden="true" />
      <div class="site-container relative">
        <p class="text-sm text-mute">Tag</p>
        <h1 class="font-display mt-2 text-4xl leading-none tracking-tight text-ink">
          {{ tag }}
        </h1>
      </div>
    </section>

    <section class="site-container pb-section">
      <div
        v-if="tagged.length"
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <PostCard
          v-for="post in tagged"
          :key="post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :category="post.category"
          :path="post.path"
        />
      </div>
      <div v-else class="card-surface max-w-prose p-8 text-charcoal">
        No posts are tagged with {{ tag }} yet.
      </div>
    </section>
  </div>
</template>
