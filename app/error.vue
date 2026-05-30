<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error.statusCode === 404)

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-canvas">
    <AppHeader />
    <main class="flex flex-1 items-center">
      <div class="site-container py-24 text-center">
        <p class="font-mono text-sm text-mute">
          {{ error.statusCode }}
        </p>
        <h1 class="font-display mt-4 text-4xl text-ink">
          {{ is404 ? 'Page not found' : 'Something went wrong' }}
        </h1>
        <p class="mt-4 text-charcoal">
          {{ is404 ? 'That URL does not match any published note.' : error.statusMessage }}
        </p>
        <div class="mt-8 flex justify-center gap-4">
          <button type="button" class="btn-primary" @click="goHome">
            Back home
          </button>
          <NuxtLink to="/search" class="btn-ghost no-underline">
            Search
          </NuxtLink>
        </div>
      </div>
    </main>
    <AppFooter />
  </div>
</template>
