<script setup lang="ts">
// Establish global baseline SEO tags for all pages using the default layout
usePortfolioSeo()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-transparent text-base-content antialiased">
    <!-- Floating Navbar -->
    <AppNavbar />

    <!-- Page Content (padded to clear floating navbar) -->
    <main class="flex-1 pt-24 md:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <slot />
    </main>

    <!-- Global Footer -->
    <AppFooter />
  </div>
</template>
