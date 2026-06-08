<script setup lang="ts">
const props = defineProps<{
  src: string
  alt?: string
  title?: string
}>()

const isOpen = ref(false)

function openZoom() {
  isOpen.value = true
}

function closeZoom() {
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeZoom()
  }
}

watch(isOpen, (newVal) => {
  if (newVal) {
    window.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    window.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <figure class="my-8 flex flex-col items-center group">
    <!-- Clickable image wrapper -->
    <div
      class="relative cursor-zoom-in overflow-hidden rounded-lg border border-hairline-strong bg-elevated/20 transition-all hover:border-hairline-strong/80"
      @click="openZoom"
    >
      <img
        :src="src"
        :alt="alt || title"
        class="max-h-[480px] w-auto max-w-full object-contain block transition-transform duration-300 group-hover:scale-[1.008]"
      />
      <!-- Hover Zoom Indicator Overlay -->
      <div class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
        <div class="rounded-full bg-black/60 p-2.5 text-ink border border-hairline-strong">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Caption -->
    <figcaption v-if="title || alt" class="mt-3 text-center text-xs text-mute font-favorit max-w-prose">
      {{ title || alt }}
    </figcaption>

    <!-- Zoomed Lightbox Modal (Teleported to Body) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-6 cursor-zoom-out"
          @click="closeZoom"
        >
          <!-- Close Button -->
          <button
            type="button"
            class="absolute right-6 top-6 rounded-full border border-hairline bg-elevated p-2 text-mute hover:border-ink hover:text-ink transition-colors cursor-pointer"
            aria-label="Close image zoom"
            @click.stop="closeZoom"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Large Zoomed Image -->
          <img
            :src="src"
            :alt="alt || title"
            class="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl border border-hairline-strong"
          />

          <!-- Modal Caption -->
          <p v-if="title || alt" class="mt-4 text-sm text-body/90 font-favorit bg-elevated/80 px-4 py-2 rounded-full border border-hairline">
            {{ title || alt }}
          </p>
        </div>
      </Transition>
    </Teleport>
  </figure>
</template>
