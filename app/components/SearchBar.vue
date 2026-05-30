<script setup lang="ts">
const { search, results, isSearching } = useSearch()

const emit = defineEmits(['update:results'])

watch(results, (newResults) => {
  emit('update:results', newResults)
})
</script>

<template>
  <div class="mb-8 flex items-center gap-4">
    <div class="relative flex-1">
      <span class="i-heroicons-magnifying-glass absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-body/30" />
      <input
        v-model="search"
        type="text"
        placeholder="Search posts, tags, or snippets"
        class="h-11 w-full rounded-xl border border-hairline bg-card pl-10 pr-4 text-sm text-ink placeholder:text-body/30 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
      />
      <div v-if="isSearching" class="absolute right-3 top-1/2 -translate-y-1/2">
        <span class="i-heroicons-arrow-path animate-spin h-4 w-4 text-body/30" />
      </div>
    </div>
    
    <button class="flex h-11 items-center gap-2 rounded-xl border border-hairline bg-card px-4 text-sm font-medium text-body hover:bg-elevated transition-colors">
      <span class="i-heroicons-funnel h-4 w-4" />
      Filter
    </button>

    <button class="bg-primary text-primary-on hover:bg-primary/90 flex h-11 items-center gap-2 rounded-xl px-5 text-sm font-bold transition-colors">
      New Post
    </button>
  </div>
</template>
