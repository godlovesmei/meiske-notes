<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const isSidebarOpen = ref(false)
const isSearchOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const activeIndex = ref(0)

const route = useRoute()
const router = useRouter()

// Get search functions
const { search, results, isSearching } = useSearch()

// Close mobile sidebar on route change
watch(() => route.path, () => {
  isSidebarOpen.value = false
  isSearchOpen.value = false
})

// Manage search index highlight reset
watch(results, () => {
  activeIndex.value = 0
})

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function openSearch() {
  isSearchOpen.value = true
  search.value = ''
  nextTick(() => {
    searchInput.value?.focus()
  })
}

function closeSearch() {
  isSearchOpen.value = false
}

function navigateToResult(path: string) {
  router.push(path)
  closeSearch()
}

function handleKeydown(e: KeyboardEvent) {
  // Global Cmd+K / Ctrl+K search toggle
  if ((e.metaKey || e.ctrlKey) && e.key?.toLowerCase() === 'k') {
    e.preventDefault()
    if (isSearchOpen.value) {
      closeSearch()
    } else {
      openSearch()
    }
  }

  // Escape to close search
  if (e.key === 'Escape' && isSearchOpen.value) {
    closeSearch()
  }

  // Keyboard navigation inside search results
  if (isSearchOpen.value && results.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % results.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeIndex.value = (activeIndex.value - 1 + results.value.length) % results.value.length
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = results.value[activeIndex.value]
      if (selected?.path) {
        navigateToResult(selected.path)
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-canvas text-body font-sans antialiased">
    <!-- Top Navigation Bar -->
    <header class="sticky top-0 z-40 h-16 w-full border-b border-hairline bg-canvas/90 backdrop-blur-md">
      <div class="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 lg:px-8">
        
        <!-- Left: Logo & Mobile Toggle -->
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-elevated text-mute hover:border-ink hover:text-ink lg:hidden cursor-pointer"
            aria-label="Toggle Navigation Sidebar"
            @click="toggleSidebar"
          >
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <NuxtLink to="/" class="font-display text-xl font-bold tracking-tight text-ink no-underline flex items-center gap-1.5">
            Mei<span class="font-sans font-normal text-mute text-base">Notes</span>
          </NuxtLink>
        </div>

        <!-- Right: Search Button & Quick Links -->
        <div class="flex items-center gap-4">
          <!-- Search trigger pill -->
          <button
            type="button"
            class="hidden sm:flex h-9 items-center gap-3 rounded-full border border-hairline bg-elevated/40 pl-3 pr-2 text-xs text-mute hover:border-hairline-strong transition-all cursor-pointer w-48 text-left"
            @click="openSearch"
          >
            <svg class="h-4 w-4 text-mute/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search guides...</span>
            <kbd class="ml-auto inline-flex h-5 items-center gap-0.5 rounded border border-hairline bg-canvas px-1.5 font-mono text-[9px] font-medium text-mute/50">
              <span class="text-[8px]">⌘</span>K
            </kbd>
          </button>

          <!-- Mobile Search Trigger -->
          <button
            type="button"
            class="flex sm:hidden h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-elevated text-mute hover:border-ink hover:text-ink cursor-pointer"
            aria-label="Search posts"
            @click="openSearch"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <NuxtLink
            to="/archive"
            class="text-sm font-medium text-charcoal hover:text-ink no-underline transition-colors hidden xs:block"
          >
            Archive
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Workspace Container (3 Columns) -->
    <div class="mx-auto flex max-w-[1440px] px-6 lg:px-8">
      <!-- Left Sidebar (Desktop: Sticky) -->
      <AppSidebarLeft
        class="hidden w-[260px] shrink-0 border-r border-hairline lg:block h-[calc(100vh-64px)] overflow-y-auto sticky top-16"
      />

      <!-- Mobile Sidebar (Slide-over drawer) -->
      <Teleport to="body">
        <div v-if="isSidebarOpen" class="fixed inset-0 z-50 flex lg:hidden">
          <!-- Backdrop overlay -->
          <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" @click="toggleSidebar" />
          
          <!-- Drawer panel -->
          <div class="relative flex w-[280px] flex-col border-r border-hairline bg-canvas p-6 overflow-y-auto shadow-2xl h-full animate-slide-in">
            <div class="flex items-center justify-between mb-8">
              <NuxtLink to="/" class="font-display text-xl font-bold tracking-tight text-ink no-underline">
                Mei<span class="font-sans font-normal text-mute text-base">Notes</span>
              </NuxtLink>
              <button
                type="button"
                class="rounded-full border border-hairline bg-elevated p-1.5 text-mute hover:text-ink cursor-pointer"
                @click="toggleSidebar"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <AppSidebarLeft :compact="true" />
          </div>
        </div>
      </Teleport>

      <!-- Main Center Content -->
      <main class="flex-1 min-w-0 py-8 lg:px-10">
        <slot />
      </main>

      <!-- Right Sidebar (TOC & Feedback) -->
      <AppSidebarRight
        class="hidden w-[260px] shrink-0 border-l border-hairline lg:block xl:block h-[calc(100vh-64px)] overflow-y-auto sticky top-16"
      />
    </div>

    <!-- Global Search Modal Dialog -->
    <Teleport to="body">
      <div
        v-if="isSearchOpen"
        class="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md p-4 pt-[10vh]"
        @click="closeSearch"
      >
        <div
          class="w-full max-w-xl overflow-hidden rounded-xl border border-hairline-strong bg-elevated shadow-2xl"
          @click.stop
        >
          <!-- Search input header -->
          <div class="relative flex items-center border-b border-hairline px-4 py-3">
            <svg class="h-5 w-5 text-mute/50 absolute left-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            
            <input
              ref="searchInput"
              v-model="search"
              type="text"
              placeholder="Search guides, tags, or concepts..."
              class="w-full bg-transparent pl-8 pr-12 text-sm text-ink placeholder:text-mute/30 focus:outline-none"
            />
            
            <div v-if="isSearching" class="absolute right-12">
              <svg class="animate-spin h-4 w-4 text-mute" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
              </svg>
            </div>

            <button
              type="button"
              class="rounded border border-hairline bg-canvas px-1.5 py-0.5 text-[10px] text-mute focus:outline-none cursor-pointer absolute right-4 hover:text-ink hover:border-mute transition-colors"
              @click="closeSearch"
            >
              ESC
            </button>
          </div>

          <!-- Search results list -->
          <div class="max-h-[360px] overflow-y-auto p-2">
            <div v-if="results.length > 0">
              <div
                v-for="(result, index) in results"
                :key="result.path"
                class="flex flex-col gap-1 rounded-lg px-4 py-3 cursor-pointer select-none transition-colors border border-transparent"
                :class="{ 'bg-primary text-primary-on': index === activeIndex, 'text-body hover:bg-hairline/30': index !== activeIndex }"
                @click="navigateToResult(result.path)"
                @mouseenter="activeIndex = index"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold truncate">{{ result.title }}</span>
                  <span
                    class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full"
                    :class="index === activeIndex ? 'bg-primary-on/15 text-primary-on' : 'bg-elevated text-mute border border-hairline'"
                  >
                    {{ result.category }}
                  </span>
                </div>
                <p
                  class="text-xs line-clamp-1"
                  :class="index === activeIndex ? 'text-primary-on/80' : 'text-charcoal'"
                >
                  {{ result.description }}
                </p>
              </div>
            </div>
            
            <!-- Empty search state -->
            <div v-else class="py-12 text-center text-sm text-mute">
              <span v-if="search.trim().length > 0">No results found for "{{ search }}".</span>
              <span v-else>Type a keyword or press arrow keys to navigate.</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
@keyframes slide-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
