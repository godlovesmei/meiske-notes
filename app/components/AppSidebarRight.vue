<script setup lang="ts">
const pinnedTopics = [
  { title: 'JavaScript debugging', desc: 'Common runtime issues, console patterns, and quick fixes.' },
  { title: 'Next.js workflows', desc: 'Routing, data fetching, UI structure, and deployment notes.' },
  { title: 'Python backend tips', desc: 'API design, validation, and error handling patterns.' },
]

const template = [
  { label: 'Problem', hint: 'What was broken?' },
  { label: 'Context', hint: 'What was the setup?' },
  { label: 'Fix', hint: 'What changed?' },
  { label: 'Lesson', hint: 'What to remember?' },
]
</script>

<template>
  <aside class="flex flex-col gap-8 py-8 pl-6">
    <!-- Secondary Profile -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-full bg-elevated border border-hairline text-xs font-bold text-ink">
        CL
      </div>
      <div>
        <h2 class="font-bold text-ink">Claire's Notes</h2>
        <p class="text-xs text-body/70">Personal learning archive</p>
      </div>
    </div>

    <!-- Pinned Topics -->
    <section class="rounded-xl border border-hairline bg-elevated/30 p-5">
      <h3 class="mb-4 text-sm font-bold text-ink">Pinned topics</h3>
      <div class="flex flex-col gap-6">
        <div v-for="topic in pinnedTopics" :key="topic.title">
          <h4 class="text-sm font-semibold text-ink group-hover:text-primary transition-colors cursor-pointer">
            {{ topic.title }}
          </h4>
          <p class="mt-1 text-xs leading-relaxed text-body/60">
            {{ topic.desc }}
          </p>
        </div>
      </div>
    </section>

    <!-- Writing Template -->
    <section class="rounded-xl border border-hairline bg-elevated/30 p-5">
      <h3 class="mb-2 text-sm font-bold text-ink">Writing template</h3>
      <p class="mb-4 text-xs text-body/60">Use this structure to keep every post consistent.</p>
      
      <div class="flex flex-col gap-2">
        <div v-for="item in template" :key="item.label" class="flex items-center justify-between rounded-lg border border-hairline bg-card p-2">
          <span class="text-[10px] font-bold uppercase tracking-wider text-body/40">{{ item.label }}</span>
          <span class="text-xs text-body/30">{{ item.hint }}</span>
        </div>
      </div>
    </section>
  </aside>
</template>
