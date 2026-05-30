<script setup lang="ts">
const appConfig = useAppConfig()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="hairline-b mt-auto border-t border-divider-soft bg-canvas">
    <div class="site-container py-16">
      <div class="grid gap-10 md:grid-cols-3">
        <div class="md:col-span-2">
          <p class="font-display text-2xl text-ink">
            {{ appConfig.site.name }}
          </p>
          <p class="mt-3 max-w-md font-favorit text-sm leading-relaxed text-charcoal">
            {{ appConfig.site.tagline }}
          </p>
        </div>
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-mute">
            Topics
          </p>
          <ul class="mt-4 space-y-2 text-sm text-ash">
            <li>
              <NuxtLink to="/?category=learn" class="no-underline hover:text-ink">
                Learn
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/?category=tutorial" class="no-underline hover:text-ink">
                Tutorials
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/?category=debugging" class="no-underline hover:text-ink">
                Debugging
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-12 border-t border-divider-soft pt-8 text-xs text-ash">
        © {{ year }} {{ appConfig.site.author }}. Built with Nuxt.
      </div>
    </div>
  </footer>
</template>
