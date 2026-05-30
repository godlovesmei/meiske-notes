<script setup lang="ts">
const route = useRoute()
const appConfig = useAppConfig()

const links = [
  { label: 'Writing', to: '/' },
  { label: 'Learn', to: '/?category=learn' },
  { label: 'Tutorials', to: '/?category=tutorial' },
  { label: 'Debugging', to: '/?category=debugging' },
]

function isActive(link: { to: string }) {
  if (link.to === '/') {
    return route.path === '/' && !route.query.category
  }
  const category = link.to.split('category=')[1]
  return route.query.category === category
}
</script>

<template>
  <header class="hairline-b sticky top-0 z-50 bg-canvas/90 backdrop-blur-md">
    <div class="site-container flex h-16 items-center justify-between gap-6">
      <NuxtLink
        to="/"
        class="font-display text-lg tracking-tight text-ink no-underline hover:text-ink"
      >
        {{ appConfig.site.name }}
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
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
      </nav>

      <NuxtLink to="/" class="btn-primary shrink-0 no-underline md:hidden">
        Posts
      </NuxtLink>
    </div>
  </header>
</template>
