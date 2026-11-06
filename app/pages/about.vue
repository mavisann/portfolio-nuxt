<script setup lang="ts">
import { Effects } from '@/components/ui/effects'

// Page-level SEO
usePortfolioSeo({
  title: 'About Me — Prince Semillano',
  description:
    'Learn more about Prince Semillano, full-stack developer & IT student. View live Discord presence, Instagram, LinkedIn, and GitHub activity.',
})
</script>

<template>
  <div class="space-y-10 md:space-y-12 text-[#E0E1DD]">
    <!-- Page Header -->
    <header class="space-y-3 text-center max-w-2xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#E0E1DD]">
        About Me
      </h1>
      <span class="text-xs font-bold uppercase tracking-widest text-[#778DA9]">
        Background & Digital Footprint
      </span>
      <p class="text-sm sm:text-base text-[#CED4DA] max-w-2xl font-normal leading-relaxed">
        A glimpse into my background and multi-platform developer footprint.
      </p>
    </header>

    <!-- Two-Column Grid: Left Sidebar (Bio & Discord) + Right Platform Tabs -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Profile, Discord Status, Activities & Bio (5 Columns) -->
      <div class="lg:col-span-5">
        <Effects :hold-delay="100">
          <AboutSidebar />
        </Effects>
      </div>

      <!-- Right Column: Animated Platform Tabs (7 Columns) -->
      <div class="lg:col-span-7">
        <PlatformTabs />
      </div>
    </div>
  </div>
</template>
