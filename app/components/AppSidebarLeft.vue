<script setup lang="ts">
const { stats } = usePostStats()

const goal = ref('')

onMounted(() => {
  goal.value = localStorage.getItem('today-goal') || ''
})

watch(goal, (newGoal) => {
  localStorage.setItem('today-goal', newGoal)
})

const navItems = [
  { label: 'Home', icon: 'i-heroicons-home', count: computed(() => stats.value.total), to: '/' },
  { label: 'Tutorials', icon: 'i-heroicons-academic-cap', count: computed(() => stats.value.categories.tutorial), to: '/?category=tutorial' },
  { label: 'Debugging', icon: 'i-heroicons-bug-ant', count: computed(() => stats.value.categories.debugging), to: '/?category=debugging' },
  { label: 'Snippets', icon: 'i-heroicons-code-bracket', count: computed(() => stats.value.tags.snippets), to: '/tags/snippets' },
  { label: 'Archive', icon: 'i-heroicons-archive-box', count: 0, to: '/archive' },
]

const focusTags = [
  { label: 'Frontend', tag: 'frontend' },
  { label: 'Backend', tag: 'backend' },
  { label: 'AI', tag: 'ai' },
  { label: 'Fixes', tag: 'fixes' },
]
</script>

<template>
  <aside class="flex flex-col gap-8 py-8 pr-6">
    <!-- Profile -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-on font-bold">
        B
      </div>
      <div>
        <h2 class="font-bold text-ink">Brain Log</h2>
        <p class="text-xs text-body/70">Notes, tutorials, debugging</p>
      </div>
    </div>

    <!-- Main Nav -->
    <nav class="flex flex-col gap-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-body transition-colors hover:bg-elevated hover:text-ink"
        active-class="bg-elevated text-ink"
      >
        <div class="flex items-center gap-3">
          <span :class="item.icon" class="h-5 w-5 text-body/50 group-hover:text-ink/70" />
          {{ item.label }}
        </div>
        <span v-if="item.count !== undefined" class="text-xs text-body/40 group-hover:text-ink/60">
          {{ item.count }}
        </span>
      </NuxtLink>
    </nav>

    <!-- Focus Section -->
    <div>
      <h3 class="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-body/50">Focus</h3>
      <div class="flex flex-wrap gap-2 px-3">
        <NuxtLink
          v-for="focus in focusTags"
          :key="focus.label"
          :to="`/tags/${focus.tag}`"
          class="badge-pill hover:bg-hairline-strong transition-colors"
        >
          {{ focus.label }}
        </NuxtLink>
      </div>
    </div>

    <!-- Today's Goal -->
    <div class="rounded-xl border border-hairline bg-elevated/50 p-4">
      <h3 class="mb-2 text-xs font-semibold text-ink">Today's goal</h3>
      <p class="mb-3 text-xs text-body/70">Capture one lesson, one mistake, and one reusable code pattern.</p>
      <textarea
        v-model="goal"
        placeholder="Type your goal here..."
        class="w-full bg-transparent text-sm text-ink placeholder:text-body/30 focus:outline-none"
        rows="3"
      ></textarea>
    </div>
  </aside>
</template>
