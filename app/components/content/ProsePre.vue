<script setup lang="ts">
defineProps<{
  code?: string
  language?: string
  class?: string
}>()
</script>

<template>
  <div class="code-window my-8 overflow-hidden rounded-lg border border-hairline-strong bg-deep">
    <div
      class="flex items-center gap-2 border-b border-hairline px-4 py-3"
      aria-hidden="true"
    >
      <span class="size-2 rounded-full bg-accent-red" />
      <span class="size-2 rounded-full bg-accent-yellow" />
      <span class="size-2 rounded-full bg-accent-green" />
      <span v-if="language" class="ml-2 font-mono text-xs text-mute">
        {{ language }}
      </span>
    </div>
    <pre class="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-body"><slot /></pre>
  </div>
</template>
