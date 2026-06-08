<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { PostCategory } from '../../content.config'

const route = useRoute()
const router = useRouter()

const pageTitle = 'MeiNotes — Developer Guides & Technical Documentation'
const pageDescription = 'Clean, focused, and professional documentation for developer workflows, backend notes, and frontend debugging.'

// Query all posts from Nuxt Content
const { data: posts } = await useAsyncData('home-posts', () => {
  return queryCollection('posts').order('date', 'DESC').all()
})

// Active category based on URL query (?category=learn)
const currentCategory = computed(() => {
  const cat = route.query.category as string
  if (['learn', 'tutorial', 'debugging'].includes(cat)) {
    return cat as PostCategory
  }
  return 'all'
})

const filteredPosts = computed(() => {
  const all = (posts.value || []).filter(p => p.draft !== true)
  if (currentCategory.value === 'all') {
    return all
  }
  return all.filter(p => p.category === currentCategory.value)
})

const counts = computed(() => {
  const all = posts.value || []
  return {
    all: all.filter(p => p.draft !== true).length,
    tutorial: all.filter(p => p.category === 'tutorial' && p.draft !== true).length,
    learn: all.filter(p => p.category === 'learn' && p.draft !== true).length,
    debugging: all.filter(p => p.category === 'debugging' && p.draft !== true).length,
  }
})

const filterOptions = [
  { label: 'All Guides', value: 'all', count: computed(() => counts.value.all) },
  { label: 'Tutorials', value: 'tutorial', count: computed(() => counts.value.tutorial) },
  { label: 'Conceptual', value: 'learn', count: computed(() => counts.value.learn) },
  { label: 'Troubleshooting', value: 'debugging', count: computed(() => counts.value.debugging) },
]

function selectCategory(cat: string) {
  if (cat === 'all') {
    router.push('/')
  } else {
    router.push(`/?category=${cat}`)
  }
}

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
})

useHead({
  titleTemplate: '%s',
})
</script>

<template>
  <div class="developer-hub select-none">
    <!-- Hero Header Portal -->
    <section class="relative overflow-hidden pb-10 pt-4">
      <!-- Ambient Glow Wash -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-gradient-to-b from-accent-blue/15 to-transparent" aria-hidden="true" />
      
      <div class="relative">
        <h1 class="font-sans text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Documentation Portal
        </h1>
        <p class="mt-3 max-w-2xl font-favorit text-sm leading-relaxed text-charcoal">
          {{ pageDescription }} Write downs on setup procedures, tooling, conceptual deep dives, and troubleshooting stories.
        </p>
      </div>
    </section>

    <!-- Quick Entry Category Portals -->
    <section class="grid gap-4 sm:grid-cols-3 mb-10">
      <!-- Tutorials Portal Card -->
      <div
        class="card-surface p-5 hover:border-accent-orange/40 transition-all cursor-pointer flex flex-col justify-between group"
        :class="{ 'border-accent-orange bg-elevated/40': currentCategory === 'tutorial' }"
        @click="selectCategory('tutorial')"
      >
        <div>
          <div class="flex items-center gap-2 text-accent-orange">
            <svg class="h-5 w-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 class="text-sm font-bold uppercase tracking-wider">Tutorials</h3>
          </div>
          <p class="mt-2 text-xs text-charcoal leading-relaxed">
            Step-by-step procedures, setup configurations, and hands-on coding walkthroughs.
          </p>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs font-semibold">
          <span class="text-mute/70">{{ counts.tutorial }} guides</span>
          <span class="text-accent-orange opacity-0 group-hover:opacity-100 transition-opacity">Explore →</span>
        </div>
      </div>

      <!-- Conceptual Portal Card -->
      <div
        class="card-surface p-5 hover:border-accent-blue/40 transition-all cursor-pointer flex flex-col justify-between group"
        :class="{ 'border-accent-blue bg-elevated/40': currentCategory === 'learn' }"
        @click="selectCategory('learn')"
      >
        <div>
          <div class="flex items-center gap-2 text-accent-blue">
            <svg class="h-5 w-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 class="text-sm font-bold uppercase tracking-wider">Concepts</h3>
          </div>
          <p class="mt-2 text-xs text-charcoal leading-relaxed">
            Deep architectural dives, specification reading notes, and framework models.
          </p>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs font-semibold">
          <span class="text-mute/70">{{ counts.learn }} guides</span>
          <span class="text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity">Explore →</span>
        </div>
      </div>

      <!-- Troubleshooting Portal Card -->
      <div
        class="card-surface p-5 hover:border-accent-red/40 transition-all cursor-pointer flex flex-col justify-between group"
        :class="{ 'border-accent-red bg-elevated/40': currentCategory === 'debugging' }"
        @click="selectCategory('debugging')"
      >
        <div>
          <div class="flex items-center gap-2 text-accent-red">
            <svg class="h-5 w-5 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <h3 class="text-sm font-bold uppercase tracking-wider">Troubleshooting</h3>
          </div>
          <p class="mt-2 text-xs text-charcoal leading-relaxed">
            Real stories of errors, runtime debugging checklists, and post-mortem notes.
          </p>
        </div>
        <div class="mt-4 flex items-center justify-between text-xs font-semibold">
          <span class="text-mute/70">{{ counts.debugging }} guides</span>
          <span class="text-accent-red opacity-0 group-hover:opacity-100 transition-opacity">Explore →</span>
        </div>
      </div>
    </section>

    <!-- Category Filters Band -->
    <div class="flex flex-wrap items-center justify-between border-b border-hairline pb-4 mb-6">
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="opt in filterOptions"
          :key="opt.value"
          type="button"
          class="inline-flex h-8 items-center gap-1.5 rounded-full border border-hairline bg-elevated/40 px-3 text-xs font-medium text-body hover:bg-elevated transition-all cursor-pointer"
          :class="{ '!bg-primary !text-primary-on !border-primary': currentCategory === opt.value }"
          @click="selectCategory(opt.value)"
        >
          {{ opt.label }}
          <span
            class="text-[9px] font-bold px-1.5 py-0.25 rounded-full border"
            :class="currentCategory === opt.value ? 'bg-primary-on/10 border-primary-on/20 text-primary-on' : 'bg-canvas border-hairline text-mute'"
          >
            {{ opt.count }}
          </span>
        </button>
      </div>
      
      <span class="text-xs text-mute font-favorit hidden sm:inline">
        Showing {{ filteredPosts.length }} of {{ counts.all }} documents
      </span>
    </div>

    <!-- Dynamic Document Grid -->
    <div v-if="filteredPosts.length > 0" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
      <PostCard
        v-for="post in filteredPosts"
        :key="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :category="post.category"
        :path="post.path"
        :reading-time="post.readingTime"
      />
    </div>

    <!-- Empty Search State -->
    <div v-else class="rounded-xl border border-dashed border-hairline-strong p-16 text-center">
      <svg class="mx-auto h-10 w-10 text-mute/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
      <h3 class="mt-4 text-sm font-semibold text-ink">No documentation guides found</h3>
      <p class="mt-1 text-xs text-mute">There are no guides matching this category right now.</p>
      <button
        type="button"
        class="mt-4 inline-flex h-8 items-center justify-center rounded-md bg-elevated border border-hairline px-4 text-xs font-semibold text-ink hover:bg-canvas transition-colors cursor-pointer"
        @click="selectCategory('all')"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
