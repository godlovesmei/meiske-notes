<script setup lang="ts">
const props = defineProps<{
  code?: string
  language?: string
  class?: string
}>()

const copied = ref(false)

async function copyCode() {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // Avoid printing raw errors or private states directly to user console
    console.warn('Copy action failed')
  }
}
</script>

<template>
  <div class="code-window my-8 overflow-hidden rounded-lg border border-hairline-strong bg-deep">
    <div
      class="flex items-center justify-between border-b border-hairline px-4 py-2.5"
    >
      <div class="flex items-center gap-2" aria-hidden="true">
        <span class="size-2 rounded-full bg-accent-red" />
        <span class="size-2 rounded-full bg-accent-yellow" />
        <span class="size-2 rounded-full bg-accent-green" />
        <span v-if="language" class="ml-2 font-mono text-xs text-mute">
          {{ language }}
        </span>
      </div>
      
      <button
        v-if="code"
        type="button"
        class="flex items-center gap-1 rounded bg-transparent px-2 py-1 font-mono text-[11px] font-medium text-mute hover:text-ink transition-colors cursor-pointer focus:outline-none"
        @click="copyCode"
      >
        <span v-if="copied" class="flex items-center gap-1 text-accent-green">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </span>
        <span v-else class="flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-6 4h6m-3-3v6" />
          </svg>
          Copy
        </span>
      </button>
    </div>
    <pre class="overflow-x-auto p-6 font-mono text-sm leading-relaxed text-body"><slot /></pre>
  </div>
</template>

