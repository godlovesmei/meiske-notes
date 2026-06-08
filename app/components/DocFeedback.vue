<script setup lang="ts">
const route = useRoute()
const feedbackSubmitted = ref(false)
const selectedOption = ref<'yes' | 'no' | null>(null)

const storageKey = computed(() => `doc-feedback-${route.path}`)

onMounted(() => {
  const stored = localStorage.getItem(storageKey.value)
  if (stored === 'yes' || stored === 'no') {
    feedbackSubmitted.value = true
    selectedOption.value = stored
  }
})

function submitFeedback(option: 'yes' | 'no') {
  localStorage.setItem(storageKey.value, option)
  selectedOption.value = option
  feedbackSubmitted.value = true
}
</script>

<template>
  <div class="mt-12 border-t border-hairline pt-8 pb-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-lg border border-hairline bg-elevated/20 p-5 font-favorit">
      <div>
        <h4 class="text-sm font-semibold text-ink">Was this page helpful?</h4>
        <p class="text-xs text-mute mt-1">Help us improve by rating your experience.</p>
      </div>

      <div class="flex items-center gap-2">
        <Transition mode="out-in" name="fade">
          <div v-if="!feedbackSubmitted" class="flex items-center gap-2">
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline-strong bg-card px-4 text-xs font-medium text-body hover:border-ink hover:text-ink hover:bg-elevated transition-all cursor-pointer focus:outline-none"
              @click="submitFeedback('yes')"
            >
              <svg class="h-4 w-4 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2m0 10V10" />
              </svg>
              Yes
            </button>
            <button
              type="button"
              class="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline-strong bg-card px-4 text-xs font-medium text-body hover:border-ink hover:text-ink hover:bg-elevated transition-all cursor-pointer focus:outline-none"
              @click="submitFeedback('no')"
            >
              <svg class="h-4 w-4 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10V19a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2m0-10v10" />
              </svg>
              No
            </button>
          </div>
          <div v-else class="flex items-center gap-2 text-xs font-semibold text-accent-green">
            <svg class="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Thank you for your feedback!</span>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
