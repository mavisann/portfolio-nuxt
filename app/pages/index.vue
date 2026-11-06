<script setup lang="ts">
import { Effects } from '@/components/ui/effects'

// Page-level SEO
usePortfolioSeo({
  title: 'Full-Stack Developer & Student',
  description:
    'Hi! I am Prince Semillano, pursuing Full-Stack Development, AI integrations, APIs, bots, and automated software solutions.',
})
</script>

<template>
  <div class="space-y-20 md:space-y-28 text-[#E0E1DD]">
    <!-- 1. Hero Section -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[70vh]">
      <!-- Left Column: Typography & Bio -->
      <div class="space-y-6 text-left">
        <!-- Subheading -->
        <span class="inline-block font-serif italic text-xl md:text-2xl text-[#778DA9]">
          Hi! I&rsquo;m
        </span>

        <!-- Main Name Headline (Bright High-Contrast Soft White) -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#E0E1DD] uppercase leading-none">
          Prince <br class="hidden sm:inline" />
          Semillano
        </h1>

        <!-- Role Badges (Deep Sea Steel Accents) -->
        <div class="flex flex-wrap gap-2 pt-1">
          <span class="badge badge-sm rounded-full bg-[#1B263B] text-[#E0E1DD] border border-[#415A77] px-3.5 py-2 font-medium">
            Full-Stack Developer
          </span>
          <span class="badge badge-sm rounded-full bg-[#1B263B] text-[#CED4DA] border border-[#415A77] px-3.5 py-2 font-medium">
            AI Integrations & APIs
          </span>
          <span class="badge badge-sm rounded-full bg-[#1B263B] text-[#CED4DA] border border-[#415A77] px-3.5 py-2 font-medium">
            Automation Systems
          </span>
        </div>

        <!-- Descriptive Paragraph (High Legibility Steel Gray) -->
        <p class="text-base sm:text-lg text-[#CED4DA] leading-relaxed max-w-xl font-normal">
          As a student pursuing Full-Stack Development, I am acquiring the skills to develop comprehensive software solutions encompassing full-stack products, AI integrations, APIs, bots, and the automation systems that ensure a business operates efficiently.
        </p>

        <!-- CTA Action Buttons -->
        <div class="flex flex-wrap items-center gap-4 pt-2">
          <NuxtLink
            to="/projects"
            class="btn rounded-full px-7 text-sm font-semibold bg-[#415A77] hover:bg-[#778DA9] text-white border-0 shadow-lg shadow-[#0D1B2A]/80 transition-all duration-300 hover:scale-[1.03]"
          >
            View Projects
          </NuxtLink>
          <NuxtLink
            to="/contact"
            class="btn rounded-full px-7 text-sm font-semibold border border-[#415A77] bg-[#1B263B]/80 hover:bg-[#1B263B] text-[#E0E1DD] transition-all duration-300"
          >
            Get in touch
          </NuxtLink>
        </div>
      </div>

      <!-- Right Column: Full Portrait Photo Card -->
      <div class="flex justify-center md:justify-end">
        <Effects :hold-delay="100">
          <div class="relative w-full max-w-sm aspect-[3/4] rounded-3xl p-3 bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 shadow-2xl group transition-transform duration-300 hover:scale-[1.01]">
            <!-- Ambient Glowing Orbs behind the photo frame -->
            <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#415A77]/25 blur-3xl group-hover:bg-[#778DA9]/25 transition-colors duration-500 pointer-events-none" />
            <div class="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#1B263B]/35 blur-3xl transition-colors duration-500 pointer-events-none" />

            <!-- Inner Image Frame: Photo fills the full rectangle -->
            <div class="w-full h-full rounded-2xl overflow-hidden bg-[#0D1B2A] border border-[#415A77]/30 relative shadow-inner">
              <img
                src="~/assets/images/profile.jpg"
                alt="Prince Semillano"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </Effects>
      </div>
    </section>

    <!-- 2. GitHub Integration Section -->
    <section class="space-y-6">
      <div class="text-center sm:text-left space-y-1">
        <span class="text-xs font-bold uppercase tracking-widest text-[#778DA9]">
          Open Source & Activity
        </span>
        <h2 class="text-3xl font-serif font-bold text-[#E0E1DD] tracking-tight">
          GitHub Highlights
        </h2>
      </div>

      <!-- Smart Component Fetching Live GraphQL Data -->
      <Effects :hold-delay="100">
        <GithubWidget />
      </Effects>
    </section>

    <!-- 3. Personal Creed / Quote (At the end of the page) -->
    <Effects :hold-delay="100">
      <section class="max-w-2xl mx-auto text-center pt-2 pb-6 space-y-3 -mt-6 md:-mt-10">
        <!-- Quote Mark SVG -->
        <div class="w-9 h-9 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#778DA9]">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 opacity-80">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <!-- Stylized Serif Quote (Bright White, High Contrast) -->
        <blockquote class="font-serif italic text-2xl sm:text-3xl text-[#E0E1DD] tracking-wide leading-snug">
          &ldquo;fake it,&rsquo;til you make it&rdquo;
        </blockquote>

        <p class="text-xs uppercase tracking-widest text-[#778DA9] font-medium">
          Eat &bull; Code &bull; Sleep &bull; Repeat
        </p>
      </section>
    </Effects>
  </div>
</template>
