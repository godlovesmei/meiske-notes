<script setup lang="ts">
import type { TocLink } from '~/utils/posts'

defineProps<{
  links: TocLink[]
}>()

const open = ref(false)
</script>

<template>
  <nav v-if="links.length" aria-label="Table of contents">
    <button
      type="button"
      class="flex w-full items-center justify-between rounded-md border border-hairline-strong bg-elevated px-4 py-3 text-sm font-medium text-ink md:hidden"
      :aria-expanded="open"
      @click="open = !open"
    >
      On this page
      <span aria-hidden="true">{{ open ? '−' : '+' }}</span>
    </button>

    <div
      class="mt-3 md:mt-0"
      :class="open ? 'block' : 'hidden md:block'"
    >
      <p class="mb-3 hidden text-xs font-medium uppercase tracking-wider text-mute md:block">
        On this page
      </p>
      <ul class="space-y-2 text-sm">
        <li v-for="link in links" :key="link.id">
          <a
            :href="`#${link.id}`"
            class="block text-charcoal no-underline transition-colors hover:text-ink"
            :class="link.depth === 3 ? 'pl-4' : ''"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>
