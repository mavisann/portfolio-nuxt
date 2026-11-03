<script setup lang="ts">
// Default layout — wraps every page with AppNavbar + AppFooter
</script>

<template>
  <div class="min-h-screen bg-transparent text-base-content flex flex-col">
    <AppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
