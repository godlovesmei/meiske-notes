<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { flattenTocLinks } from '~/utils/posts'

const route = useRoute()
const activeHeadingId = ref('')

const isPostPage = computed(() => route.path.startsWith('/posts/'))
const slug = computed(() => {
  if (isPostPage.value) {
    const segment = route.path.split('/').filter(Boolean).pop()
    return segment || ''
  }
  return ''
})

// Query active post content for the TOC on posts
const { data: activePost } = await useAsyncData(
  () => `right-sidebar-toc-${slug.value}`,
  async () => {
    if (!slug.value) return null
    return queryCollection('posts').path(`/posts/${slug.value}`).first()
  },
  { watch: [slug] }
)

const tocLinks = computed(() => {
  if (!activePost.value) return []
  return flattenTocLinks((activePost.value as any)?.toc?.links)
})

// Scroll Spy implementation
function updateActiveHeading() {
  if (!tocLinks.value.length) return
  
  const headings = tocLinks.value
    .map((link) => document.getElementById(link.id))
    .filter(Boolean) as HTMLElement[]
    
  if (headings.length === 0) return

  // Offset matching sticky header height + safety padding (64px header + 20px padding)
  const offset = 90
  let currentActive = headings[0].id

  for (const heading of headings) {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= offset) {
      currentActive = heading.id
    } else {
      break
    }
  }

  activeHeadingId.value = currentActive
}

function scrollToHeading(id: string) {
  const el = document.getElementById(id)
  if (el) {
    // Offset for the 64px sticky navbar
    const yOffset = -80 
    const y = el.getBoundingClientRect().top + window.scrollY + yOffset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

// Watch scroll events
onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading)
  // Run once initially
  setTimeout(updateActiveHeading, 200)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveHeading)
})

// Re-check headings when page updates
watch(() => route.path, () => {
  setTimeout(updateActiveHeading, 300)
})

const resources = [
  { title: 'Google Dev Docs', desc: 'UX benchmarks for clear structural guides.', url: 'https://developers.google.com' },
  { title: 'Nuxt 4 Documentation', desc: 'Framework updates, routing changes, and API guides.', url: 'https://nuxt.com/docs' },
  { title: 'Nuxt Content v3', desc: 'Document schemas, markdown processing, and custom renderers.', url: 'https://content.nuxt.com' }
]
</script>

<template>
  <aside class="flex flex-col gap-6 py-6 font-favorit" :class="isPostPage ? 'pl-6' : 'pl-6'">
    <!-- Post Table of Contents (Active State) -->
    <section v-if="isPostPage && tocLinks.length > 0" class="flex flex-col gap-3">
      <h3 class="text-xs font-bold uppercase tracking-wider text-mute/60 border-b border-hairline pb-2">
        On This Page
      </h3>
      <div class="relative flex flex-col gap-1.5 border-l border-hairline pl-1.5">
        <button
          v-for="link in tocLinks"
          :key="link.id"
          type="button"
          class="text-left text-xs text-body hover:text-ink transition-colors cursor-pointer block py-1.5 pr-2 focus:outline-none relative"
          :class="[
            link.depth === 3 ? 'pl-4' : 'pl-2',
            link.id === activeHeadingId ? 'text-ink font-semibold border-l-2 border-accent-blue -ml-[7px] pl-3.5' : ''
          ]"
          @click="scrollToHeading(link.id)"
        >
          {{ link.text }}
        </button>
      </div>
    </section>

    <!-- Key Resources / Links (Fallback State for Homepage/Archive) -->
    <section v-else class="flex flex-col gap-6">
      <!-- Pinned resources -->
      <div class="rounded-xl border border-hairline bg-elevated/30 p-5">
        <h3 class="mb-4 text-xs font-bold uppercase tracking-wider text-mute/70 border-b border-hairline pb-1.5">
          Key Resources
        </h3>
        <div class="flex flex-col gap-5">
          <div v-for="res in resources" :key="res.title">
            <a
              :href="res.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-semibold text-ink hover:text-link transition-colors flex items-center gap-1 group no-underline"
            >
              {{ res.title }}
              <svg class="h-3.5 w-3.5 text-mute opacity-50 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <p class="mt-1 text-xs leading-relaxed text-charcoal">
              {{ res.desc }}
            </p>
          </div>
        </div>
      </div>

      <!-- Quick Feedback Box -->
      <div class="rounded-xl border border-hairline bg-elevated/20 p-5 border-dashed">
        <h4 class="text-xs font-bold text-ink mb-2">Authoring Guides</h4>
        <p class="text-xs leading-relaxed text-mute/80 mb-3">
          To build a new documentation page, run this command in your project terminal:
        </p>
        <code class="block rounded bg-deep p-2.5 font-mono text-[10px] text-accent-orange border border-hairline-strong select-all">
          pnpm new-post my-guide-slug
        </code>
      </div>
    </section>
  </aside>
</template>
