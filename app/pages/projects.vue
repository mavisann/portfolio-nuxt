<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Project } from '~~/shared/types'
import ProjectCard from '~/components/ProjectCard.vue'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Effects } from '@/components/ui/effects'

// Page-level SEO Metadata
usePortfolioSeo({
  title: 'Featured Projects — Prince Semillano',
  description:
    'Explore featured full-stack projects, web applications, real-time systems, and tools developed by Prince Semillano.',
})

// Available Filter Categories
const filterCategories = [
  'All',
  'JavaScript',
  'HTML',
  'CSS',
  'Java',
  'Vue',
  'TypeScript',
] as const

type FilterCategory = (typeof filterCategories)[number]

// Active filter state (default: 'All')
const activeFilter = ref<FilterCategory>('All')

// Curated Project Showcase
const projects = ref<Project[]>([
  {
    id: 1,
    title: 'Mavis Personal Tracker',
    description:
      'Mavis, your personal tracker, a web application that helps you keep track of your tasks, schedules, and budgets. Powered by Google Sign-in, can syncs in your Google Calendar.',
    liveUrl: 'https://mavisann.github.io/Mavis-Personal-Tracker/login.html',
    codeUrl: 'https://github.com/mavisann/Mavis-Personal-Tracker',
    languages: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 2,
    title: 'Mr. and Ms. SDCA Coronation Night Tabulation System',
    description:
      'Real-time automated scoring and tabulation platform built for Mr. and Ms. SDCA Coronation Night, supporting judges tablets, real-time sync, and instant leaderboard calculation.',
    liveUrl: 'https://sdca-tabulation.onrender.com',
    codeUrl: 'https://github.com/mavisann/sdca-tabulation',
    languages: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 3,
    title: 'Mr. and Ms. SDCA Pre Pageant Tabulation System',
    description:
      'Real-time automated scoring and tabulation platform built for Mr. and Ms. SDCA Pre Pageant, supporting judges tablets, real-time sync, and instant leaderboard calculation.',
    liveUrl: 'https://sdca-tabulation-prepageant.onrender.com',
    codeUrl: 'https://github.com/johndextercullados/sdca-tabulation-prepageant',
    languages: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 4,
    title: 'SDCA Kulayawan Tabulation System',
    description:
      'Real-time automated scoring and tabulation platform built for SDCA Kulayawan, supporting judges tablets, real-time sync, and instant leaderboard calculation.',
    liveUrl: 'https://sdca-tabulation-kulayawan.onrender.com',
    codeUrl: 'https://github.com/DominicHonrado/sdca-tabulation-kulayawan',
    languages: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 5,
    title: 'Personal Portfolio',
    description:
      'A personal portfolio website built with Nuxt 3 and Tailwind CSS, showcasing my projects and skills.',
    liveUrl: 'https://prince-semillano-portfolio.onrender.com',
    codeUrl: 'https://github.com/mavisann/sdca-tabulation',
    languages: ['Vue', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
  },
])

// Computed filtered projects matching active filter selection
const filteredProjects = computed(() => {
  if (activeFilter.value === 'All') {
    return projects.value
  }
  return projects.value.filter((project) =>
    project.languages.includes(activeFilter.value)
  )
})

// Dynamic count badge per filter category
const getCategoryCount = (category: FilterCategory): number => {
  if (category === 'All') {
    return projects.value.length
  }
  return projects.value.filter((project) => project.languages.includes(category)).length
}
</script>

<template>
  <div class="space-y-10 md:space-y-12 text-[#E0E1DD]">
    <!-- 1. Centered Page Header -->
    <header class="space-y-3 text-center max-w-2xl mx-auto">
      <h1 class="text-4xl sm:text-5xl font-serif font-black tracking-tight text-[#E0E1DD]">
        Featured Projects
      </h1>
      <span class="text-xs font-bold uppercase tracking-widest text-[#778DA9]">
        Full-Stack Systems & Web Applications
      </span>
      <p class="text-sm sm:text-base text-[#CED4DA] font-normal leading-relaxed">
        A curated showcase of production applications, AI systems, cloud-connected platforms, and developer utilities built with modern frameworks.
      </p>
    </header>

    <!-- 2. Segmented Control / Filter Tabs -->
    <Tabs v-model="activeFilter" default-value="All" class="w-full space-y-8">
      <div class="flex justify-center overflow-x-auto py-1 px-2 no-scrollbar">
        <TabsList class="flex flex-wrap justify-center gap-1.5 p-1.5 max-w-full">
          <TabsTrigger
            v-for="cat in filterCategories"
            :key="cat"
            :value="cat"
            class="flex items-center gap-2 py-2"
          >
            <span>{{ cat }}</span>
            <span
              class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-mono transition-colors"
              :class="activeFilter === cat ? 'bg-[#0D1B2A]/70 text-white' : 'bg-[#0D1B2A]/40 text-[#778DA9]'"
            >
              {{ getCategoryCount(cat) }}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <!-- 3. Projects Grid with Scroll-Triggered Reveal Animation -->
      <Effects
        v-if="filteredProjects.length > 0"
        :key="activeFilter"
        :hold-delay="90"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-stretch"
      >
        <ProjectCard
          v-for="project in filteredProjects"
          :key="project.id"
          :project="project"
        />
      </Effects>

      <!-- 4. Empty State Fallback -->
      <div
        v-else
        class="text-center py-16 px-4 bg-[#1B263B]/30 border border-[#415A77]/30 rounded-3xl max-w-lg mx-auto space-y-3"
      >
        <div
          class="w-12 h-12 mx-auto rounded-full bg-[#1B263B] border border-[#415A77]/40 flex items-center justify-center text-[#778DA9]"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <p class="text-base font-serif font-bold text-[#E0E1DD]">No projects found</p>
        <p class="text-xs text-[#CED4DA]">
          There are no projects tagged under "{{ activeFilter }}".
        </p>
      </div>
    </Tabs>
  </div>
</template>
