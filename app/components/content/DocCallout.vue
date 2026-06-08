<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'info' | 'warning' | 'tip' | 'danger'
    title?: string
  }>(),
  {
    type: 'info',
  }
)

const config = computed(() => {
  switch (props.type) {
    case 'tip':
      return {
        wrapperClass: 'border-l-4 border-accent-green bg-elevated/40 text-body',
        titleClass: 'text-accent-green',
        titleText: props.title || 'Tip',
        icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
      }
    case 'warning':
      return {
        wrapperClass: 'border-l-4 border-accent-orange bg-elevated/40 text-body',
        titleClass: 'text-accent-orange',
        titleText: props.title || 'Warning',
        icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
      }
    case 'danger':
      return {
        wrapperClass: 'border-l-4 border-accent-red bg-elevated/40 text-body',
        titleClass: 'text-accent-red',
        titleText: props.title || 'Caution',
        icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636'
      }
    case 'info':
    default:
      return {
        wrapperClass: 'border-l-4 border-accent-blue bg-elevated/40 text-body',
        titleClass: 'text-accent-blue',
        titleText: props.title || 'Note',
        icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
      }
  }
})
</script>

<template>
  <div class="my-6 flex gap-4 rounded-r-lg border border-hairline bg-card p-5 shadow-sm" :class="config.wrapperClass">
    <div class="mt-0.5 shrink-0" :class="config.titleClass">
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" :d="config.icon" />
      </svg>
    </div>
    <div class="min-w-0 flex-1">
      <h5 class="font-sans text-sm font-semibold uppercase tracking-wider mb-2" :class="config.titleClass">
        {{ config.titleText }}
      </h5>
      <div class="text-sm leading-relaxed text-body prose-callout">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.prose-callout p {
  margin: 0 !important;
}
.prose-callout p + p {
  margin-top: 0.5rem !important;
}
</style>
