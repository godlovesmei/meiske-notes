<script setup lang="ts">
const appConfig = useAppConfig()

useSeoMeta({
  title: 'About',
  description: appConfig.site.tagline,
})
</script>

<template>
  <div>
    <section class="relative overflow-hidden pb-16 pt-20 md:pt-28">
      <div class="pointer-events-none absolute inset-x-0 top-0 h-[380px] glow-learn" aria-hidden="true" />
      <div class="site-container relative max-w-prose">
        <h1 class="font-display text-4xl leading-none tracking-tight text-ink sm:text-5xl">
          About
        </h1>
        <p class="mt-6 text-lg leading-relaxed text-charcoal">
          {{ appConfig.site.name }} is a personal notebook for things I am learning,
          tutorials I want to remember, and debugging stories worth keeping.
        </p>
      </div>
    </section>

    <section class="site-container pb-section">
      <div class="card-surface max-w-prose space-y-8 p-8 md:p-10">
        <div>
          <h2 class="text-xl font-medium tracking-tight text-ink">Learn</h2>
          <p class="mt-3 text-body leading-relaxed">
            Notes while working through new concepts — written to clarify thinking,
            not to sound authoritative.
          </p>
        </div>
        <div>
          <h2 class="text-xl font-medium tracking-tight text-ink">Tutorials</h2>
          <p class="mt-3 text-body leading-relaxed">
            Step-by-step guides for tools and workflows I actually use. Favor reproducible
            commands and short explanations over long preamble.
          </p>
        </div>
        <div>
          <h2 class="text-xl font-medium tracking-tight text-ink">Debugging</h2>
          <p class="mt-3 text-body leading-relaxed">
            Post-mortems from things that broke — what failed, what fixed it, and what
            I would check first next time.
          </p>
        </div>
        <p class="text-sm text-mute">
          — {{ appConfig.site.author }}
        </p>
      </div>
    </section>
  </div>
</template>
