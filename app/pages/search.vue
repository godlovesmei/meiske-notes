<script setup lang="ts">
import { searchPosts, type SearchDocument } from '~/composables/useSearch'

const route = useRoute()
const router = useRouter()

const query = ref((route.query.q as string) ?? '')
const results = ref<SearchDocument[]>([])
const searching = ref(false)

async function runSearch(value: string) {
  const trimmed = value.trim()
  if (!trimmed) {
    results.value = []
    return
  }
  searching.value = true
  try {
    results.value = await searchPosts(trimmed)
  } finally {
    searching.value = false
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    router.replace({ query: value.trim() ? { q: value.trim() } : {} })
    runSearch(value)
  }, 250)
})

onMounted(() => {
  if (query.value.trim()) runSearch(query.value)
})

useSeoMeta({
  title: 'Search',
  description: 'Search notes on learning, tutorials, and debugging.',
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden pb-12 pt-20 md:pt-24">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[320px] glow-learn" aria-hidden="true" />
      <div class="site-container relative max-w-prose">
        <h1 class="font-display text-4xl leading-none tracking-tight text-ink">
          Search
        </h1>
        <p class="mt-4 text-charcoal">
          Find notes by title, description, tags, or body text.
        </p>
        <label class="mt-8 block">
          <span class="sr-only">Search query</span>
          <input
            v-model="query"
            type="search"
            name="q"
            placeholder="e.g. hydration, nuxt content, promises"
            class="w-full rounded-md border border-hairline-strong bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-mute focus:border-ink"
            autocomplete="off"
          />
        </label>
      </div>
    </section>

    <section class="site-container pb-section">
      <p v-if="searching" class="text-sm text-mute">Searching…</p>
      <p v-else-if="query.trim() && !results.length" class="text-sm text-charcoal">
        No results for “{{ query.trim() }}”.
      </p>
      <p v-else-if="!query.trim()" class="text-sm text-charcoal">
        Type to search across all published posts.
      </p>

      <ul v-else class="mx-auto max-w-prose space-y-4">
        <li v-for="result in results" :key="result.path">
          <NuxtLink
            :to="result.path"
            class="card-surface block p-5 no-underline transition-colors hover:border-ink/20"
          >
            <div class="flex flex-wrap items-center gap-2">
              <CategoryBadge :category="result.category" />
              <time class="text-xs text-mute" :datetime="result.date">
                {{ result.date }}
              </time>
            </div>
            <h2 class="mt-2 font-medium text-ink">{{ result.title }}</h2>
            <p class="mt-1 text-sm text-charcoal">{{ result.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>
