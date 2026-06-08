<script setup lang="ts">
import type { PostCategory } from '../../content.config'

const appConfig = useAppConfig()
const { search, results, isSearching } = useSearch()

const typedResults = computed(() =>
  results.value.map(result => ({
    ...result,
    category: result.category as PostCategory,
  })),
)

useSeoMeta({
  title: `Search · ${appConfig.site.name}`,
  description: 'Search across published notes.',
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden pb-12 pt-20 md:pt-24">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[320px] glow-learn" aria-hidden="true" />
      <div class="site-container relative max-w-prose">
        <p class="text-sm text-mute">Search</p>
        <h1 class="font-display mt-2 text-4xl leading-none tracking-tight text-ink sm:text-5xl">
          Find a note
        </h1>
        <p class="mt-4 text-charcoal">
          Search titles, descriptions, tags, and body text across the archive.
        </p>

        <div class="relative mt-8">
          <input
            v-model="search"
            type="search"
            placeholder="Search posts, tags, or snippets"
            class="h-11 w-full rounded-xl border border-hairline bg-card pl-4 pr-12 text-sm text-ink placeholder:text-body/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
          <div v-if="isSearching" class="absolute right-3 top-1/2 -translate-y-1/2">
            <span class="i-heroicons-arrow-path animate-spin h-4 w-4 text-body/30" />
          </div>
        </div>
      </div>
    </section>

    <section class="site-container pb-section">
      <h2 class="mb-6 text-xl font-bold text-ink">
        Search results {{ typedResults.length ? `(${typedResults.length})` : '' }}
      </h2>

      <div v-if="typedResults.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PostCard
          v-for="post in typedResults"
          :key="post.path"
          :title="post.title"
          :description="post.description"
          :date="post.date"
          :category="post.category"
          :path="post.path"
        />
      </div>

      <div v-else class="card-surface max-w-prose p-8 text-charcoal">
        Start typing to search your notes.
      </div>
    </section>
  </div>
</template>