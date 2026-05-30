<script setup lang="ts">
const { stats } = usePostStats()

const statItems = computed(() => [
  { label: 'Posts', count: stats.value.total },
  { label: 'Tutorials', count: stats.value.categories.tutorial },
  { label: 'Debug Logs', count: stats.value.categories.debugging },
])
</script>

<template>
  <div class="mb-10 overflow-hidden rounded-3xl bg-[#111827] p-8 text-white lg:p-12">
    <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <!-- Left: CTA -->
      <div class="flex-1 space-y-4">
        <h1 class="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
          Write clean<br />notes for what<br />you learn.
        </h1>
        <p class="max-w-md text-lg text-white/60">
          A simple blog workspace designed for tutorials, debugging logs, and practical learning notes. The layout keeps the focus on content, structure, and readability.
        </p>
        
        <div class="mt-8 flex gap-8">
          <div v-for="item in statItems" :key="item.label" class="space-y-1">
            <div class="text-3xl font-bold">{{ item.count }}</div>
            <div class="text-xs font-medium uppercase tracking-widest text-white/40">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- Right: Feature Cards -->
      <div class="grid w-full gap-4 sm:grid-cols-2 lg:w-[400px]">
        <div class="rounded-2xl bg-white/5 p-6 backdrop-blur-sm border border-white/10">
          <h3 class="mb-2 font-bold">Writing mode</h3>
          <p class="text-xs leading-relaxed text-white/50">
            Use short sections: problem, approach, code, result, and takeaway.
          </p>
        </div>
        <div class="rounded-2xl bg-white/5 p-6 backdrop-blur-sm border border-white/10">
          <h3 class="mb-2 font-bold">Best for</h3>
          <p class="text-xs leading-relaxed text-white/50">
            Personal knowledge base, learning journal, and technical note-taking.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
