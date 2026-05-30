<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const menuOpen = ref(false)

const links = [
  { label: 'Writing', to: '/' },
  { label: 'Learn', to: '/?category=learn' },
  { label: 'Tutorials', to: '/?category=tutorial' },
  { label: 'Debugging', to: '/?category=debugging' },
  { label: 'Archive', to: '/archive' },
  { label: 'About', to: '/about' },
]

function isActive(link: { to: string }) {
  if (link.to === '/') {
    return route.path === '/' && !route.query.category
  }
  if (link.to.startsWith('/?category=')) {
    const category = link.to.split('category=')[1]
    return route.path === '/' && route.query.category === category
  }
  return route.path === link.to
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
})
</script>

<template>
  <header class="hairline-b sticky top-0 z-50 bg-canvas/90 backdrop-blur-md">
    <div class="site-container flex h-16 items-center justify-between gap-4">
      <NuxtLink
        to="/"
        class="font-display text-lg tracking-tight text-ink no-underline hover:text-ink"
      >
        {{ appConfig.site.name }}
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Main">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="rounded-md px-3 py-2 text-sm font-medium tracking-wide no-underline transition-colors"
          :class="
            isActive(link)
              ? 'bg-elevated text-ink'
              : 'text-charcoal hover:bg-elevated/60 hover:text-ink'
          "
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          to="/search"
          class="rounded-md px-3 py-2 text-sm font-medium tracking-wide text-charcoal no-underline transition-colors hover:bg-elevated/60 hover:text-ink"
          :class="route.path === '/search' ? 'bg-elevated text-ink' : ''"
        >
          Search
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-2 lg:hidden">
        <NuxtLink
          to="/search"
          class="rounded-md px-3 py-2 text-sm font-medium text-charcoal no-underline hover:text-ink"
          aria-label="Search"
        >
          Search
        </NuxtLink>
        <button
          type="button"
          class="btn-ghost px-3"
          :aria-expanded="menuOpen"
          aria-controls="mobile-nav"
          @click="menuOpen = !menuOpen"
        >
          {{ menuOpen ? 'Close' : 'Menu' }}
        </button>
      </div>
    </div>

    <div
      v-show="menuOpen"
      id="mobile-nav"
      class="hairline-b border-t border-hairline bg-canvas lg:hidden"
    >
      <nav class="site-container flex flex-col gap-1 py-4" aria-label="Mobile">
        <NuxtLink
          v-for="link in links"
          :key="`mobile-${link.to}`"
          :to="link.to"
          class="sub-nav-pill w-fit no-underline"
          :class="isActive(link) ? 'text-ink' : 'text-charcoal'"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
