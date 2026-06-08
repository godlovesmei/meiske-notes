<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  compact?: boolean
}>()

const route = useRoute()

// Fetch all published posts
const { data: posts } = await useAsyncData('sidebar-posts', () => {
  return queryCollection('posts').order('date', 'DESC').all()
})

const categories = computed(() => {
  const all = posts.value || []
  
  return [
    {
      id: 'tutorial',
      label: 'Tutorials',
      desc: 'Step-by-step developer guides',
      iconPath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253', // Book icon
      items: all.filter(p => p.category === 'tutorial' && p.draft !== true)
    },
    {
      id: 'learn',
      label: 'Conceptual Learning',
      desc: 'Deep dives and study notes',
      iconPath: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z', // Lightbulb icon
      items: all.filter(p => p.category === 'learn' && p.draft !== true)
    },
    {
      id: 'debugging',
      label: 'Troubleshooting',
      desc: 'Debugging stories and fixes',
      iconPath: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', // Bug/Danger icon
      items: all.filter(p => p.category === 'debugging' && p.draft !== true)
    }
  ]
})
</script>

<template>
  <aside class="flex flex-col gap-6 py-6 font-favorit" :class="compact ? '' : 'pr-4'">
    <!-- Navigation Sections -->
    <div v-for="cat in categories" :key="cat.id" class="flex flex-col gap-2">
      <!-- Category Header -->
      <div class="flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-mute/60 border-b border-hairline pb-1">
        <svg class="h-4 w-4 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" :d="cat.iconPath" />
        </svg>
        <span>{{ cat.label }}</span>
        <span class="ml-auto text-[10px] bg-elevated/80 border border-hairline px-1.5 rounded-full font-mono font-medium text-mute/50">
          {{ cat.items.length }}
        </span>
      </div>

      <!-- Category Guides List -->
      <div v-if="cat.items.length > 0" class="flex flex-col gap-0.5 pl-2">
        <NuxtLink
          v-for="item in cat.items"
          :key="item.path"
          :to="item.path"
          class="group flex items-center justify-between rounded-md px-3 py-2 text-sm text-body hover:bg-elevated/50 hover:text-ink transition-colors no-underline border-l-2 border-transparent"
          active-class="!text-ink bg-elevated/70 !border-accent-blue font-medium shadow-sm"
        >
          <span class="truncate pr-2">{{ item.title }}</span>
          <svg class="h-3.5 w-3.5 text-mute/30 group-hover:text-ink/60 opacity-0 group-hover:opacity-100 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </NuxtLink>
      </div>

      <!-- Empty Category State -->
      <div v-else class="px-6 py-2 text-xs text-mute/40 italic">
        No documents available
      </div>
    </div>
  </aside>
</template>
