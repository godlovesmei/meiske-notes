<template>
  <div class="mx-auto flex min-h-screen max-w-[1440px] px-6 lg:px-8">
    <!-- Left Sidebar -->
    <AppSidebarLeft class="hidden w-[280px] shrink-0 border-r border-hairline lg:block" />

    <!-- Main Content -->
    <main class="flex-1 overflow-hidden py-8 lg:px-10">
      <slot />
    </main>

    <!-- Right Sidebar -->
    <AppSidebarRight class="hidden w-[320px] shrink-0 border-l border-hairline lg:block" />
  </div>
</template>
