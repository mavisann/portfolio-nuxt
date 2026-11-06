<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { Project } from '~~/shared/types'

const props = defineProps<{
  project?: Project
  id?: number
  title?: string
  description?: string
  liveUrl?: string
  codeUrl?: string
  languages?: string[]
}>()

// Unified accessors supporting either a direct project object or individual props
const projectTitle = computed(() => props.project?.title || props.title || 'Untitled Project')
const projectDescription = computed(() => props.project?.description || props.description || '')
const projectLiveUrl = computed(() => props.project?.liveUrl || props.liveUrl || '')
const projectCodeUrl = computed(() => props.project?.codeUrl || props.codeUrl || '')
const projectLanguages = computed(() => props.project?.languages || props.languages || [])

const hasLiveUrl = computed(() => !!projectLiveUrl.value && projectLiveUrl.value !== '#')
const hasCodeUrl = computed(() => !!projectCodeUrl.value && projectCodeUrl.value !== '#')

// Full URL displayed in the fixed mini web search bar, maximized for long links
const displayUrl = computed(() => {
  if (hasLiveUrl.value) {
    return projectLiveUrl.value
  }
  if (hasCodeUrl.value) {
    return projectCodeUrl.value
  }
  return 'https://semillano.dev/projects/' + projectTitle.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')
})

// Language color mapping for authentic GitHub-style language dots
const languageColors: Record<string, string> = {
  Vue: '#41b883',
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  Java: '#b07219',
  'Full-Stack': '#00ADD8',
}

const getLanguageColor = (lang: string): string => {
  return languageColors[lang] || '#778DA9'
}

// ── Full-Size (Non-Zoomed) Desktop Iframe Preview Scaling ───────────
// Desktop reference resolution (1280x720 16:9). The iframe renders full-scale desktop layout,
// scaled down via CSS transform so nothing is zoomed in or cut off.
const viewportRef = ref<HTMLElement | null>(null)
const iframeScale = ref(0.28)
let resizeObserver: ResizeObserver | null = null

const updateScale = () => {
  if (viewportRef.value) {
    const width = viewportRef.value.clientWidth
    if (width > 0) {
      iframeScale.value = width / 1280
    }
  }
}

onMounted(() => {
  nextTick(() => {
    updateScale()
    if (viewportRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateScale()
      })
      resizeObserver.observe(viewportRef.value)
    }
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

const handleBrowserClick = () => {
  if (hasLiveUrl.value && import.meta.client) {
    window.open(projectLiveUrl.value, '_blank', 'noopener,noreferrer')
  } else if (hasCodeUrl.value && import.meta.client) {
    window.open(projectCodeUrl.value, '_blank', 'noopener,noreferrer')
  }
}
</script>

<template>
  <article
    class="group bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 hover:border-[#778DA9]/60 rounded-3xl p-5 sm:p-6 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between gap-5 h-full w-full"
  >
    <!-- Top & Content Section (Expands flexibly to match tallest card) -->
    <div class="flex-1 flex flex-col gap-4">
      <!-- Mini-Browser -->
      <div
        class="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0D1B2A] border border-[#415A77]/40 flex flex-col shadow-inner select-none group/browser transition-all duration-300 shrink-0"
      >
        <!-- Fixed Mini Web Search Bar -->
        <div
          class="h-8 px-2.5 bg-[#0D1B2A]/95 border-b border-[#415A77]/40 flex items-center gap-2 text-xs z-30 shrink-0 select-none"
        >
          <!-- Window Dots -->
          <div class="flex items-center gap-1.5 shrink-0 pl-0.5">
            <span class="w-2.5 h-2.5 rounded-full bg-[#EF4444] inline-block shadow-xs" />
            <span class="w-2.5 h-2.5 rounded-full bg-[#F59E0B] inline-block shadow-xs" />
            <span class="w-2.5 h-2.5 rounded-full bg-[#10B981] inline-block shadow-xs" />
          </div>

          <!-- Search/Address Bar -->
          <div
            class="flex-1 min-w-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B263B]/90 border border-[#415A77]/50 shadow-inner group-hover/browser:border-[#778DA9]/60 transition-colors"
          >
            <!-- Lock Icon -->
            <svg
              class="w-3 h-3 text-[#778DA9] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <!-- Full Long Link -->
            <span class="text-[11px] font-mono text-[#CED4DA] tracking-tight truncate flex-1 block">
              {{ displayUrl }}
            </span>
            <!-- Refresh Icon -->
            <svg
              class="w-2.5 h-2.5 text-[#778DA9]/70 shrink-0 group-hover/browser:rotate-180 transition-transform duration-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M21 21v-5h-5" />
            </svg>
          </div>
        </div>

        <!-- Mini-Browser Viewport Area (Full-Size Desktop Scale) -->
        <div
          ref="viewportRef"
          class="relative flex-1 w-full h-full overflow-hidden bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A]"
        >
          <!-- Ambient Glow Blobs -->
          <div class="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#415A77]/25 blur-2xl pointer-events-none" />
          <div class="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-[#778DA9]/20 blur-2xl pointer-events-none" />

          <!-- Background High-Fidelity Desktop Mockup -->
          <div class="absolute inset-0 flex flex-col justify-between p-3 select-none pointer-events-none z-0">

            <!-- Mock Desktop Bottom Grid / Footer -->
            <div class="grid grid-cols-3 gap-1.5 pt-1.5 border-t border-[#415A77]/10">
              <div class="h-1.5 rounded bg-[#415A77]/25" />
              <div class="h-1.5 rounded bg-[#415A77]/35" />
              <div class="h-1.5 rounded bg-[#415A77]/25" />
            </div>
          </div>

          <!-- Embedded Full-Size Desktop Iframe (1280x720 scaled to fit viewport without zooming in) -->
          <iframe
            v-if="hasLiveUrl"
            :src="projectLiveUrl"
            :title="projectTitle + ' Live Desktop Preview'"
            class="absolute top-0 left-0 border-0 pointer-events-none z-[1] select-none opacity-90 group-hover/browser:opacity-100 transition-opacity duration-300"
            :style="{
              width: '1280px',
              height: '720px',
              transform: `scale(${iframeScale})`,
              transformOrigin: '0 0',
            }"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
          />

          <!-- CRITICAL: Transparent Capture Layer over Viewport -->
          <!-- Prevents iframe from stealing mouse/pointer events, protecting the website cursor -->
          <div
            class="absolute inset-0 z-20 cursor-none"
            :role="hasLiveUrl || hasCodeUrl ? 'button' : undefined"
            :tabindex="hasLiveUrl || hasCodeUrl ? 0 : undefined"
            :aria-label="'Open ' + projectTitle"
            @click="handleBrowserClick"
            @keydown.enter="handleBrowserClick"
            @keydown.space.prevent="handleBrowserClick"
          />
        </div>
      </div>

      <!-- Tech Stack & Languages -->
      <div v-if="projectLanguages.length > 0" class="flex flex-wrap items-center gap-1.5">
        <span
          v-for="lang in projectLanguages"
          :key="lang"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-[#0D1B2A]/70 border border-[#415A77]/40 text-[#CED4DA] shadow-xs"
        >
          <span
            class="w-2 h-2 rounded-full shrink-0"
            :style="{ backgroundColor: getLanguageColor(lang) }"
          />
          <span>{{ lang }}</span>
        </span>
      </div>

      <!-- Title & Full Description -->
      <div class="flex-1 flex flex-col gap-2">
        <h3
          class="text-lg sm:text-xl font-serif font-bold text-[#E0E1DD] group-hover:text-white transition-colors tracking-tight leading-snug break-words"
        >
          {{ projectTitle }}
        </h3>
        <p class="text-xs sm:text-sm text-[#CED4DA] leading-relaxed font-normal break-words">
          {{ projectDescription }}
        </p>
      </div>
    </div>

    <!-- Live Demo & Source Code Buttons -->
    <div class="grid grid-cols-2 gap-2.5 pt-4 border-t border-[#415A77]/20 mt-auto">
      <!-- Live Demo Button -->
      <a
        v-if="hasLiveUrl"
        :href="projectLiveUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#415A77] hover:bg-[#778DA9] text-white shadow-md transition-all duration-200 hover:shadow-lg active:scale-95"
      >
        <svg
          class="w-3.5 h-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
        <span>Live Demo</span>
      </a>
      <span
        v-else
        class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1B263B]/40 text-[#778DA9]/50 border border-[#415A77]/20 cursor-not-allowed select-none"
      >
        <span>Internal Only</span>
      </span>

      <!-- Source Code Button -->
      <a
        v-if="hasCodeUrl"
        :href="projectCodeUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1B263B]/60 hover:bg-[#415A77]/30 text-[#E0E1DD] hover:text-white border border-[#415A77]/50 hover:border-[#778DA9] shadow-xs transition-all duration-200 active:scale-95"
      >
        <svg
          class="w-3.5 h-3.5 text-[#778DA9]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
        <span>Code</span>
      </a>
      <span
        v-else
        class="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-[#1B263B]/40 text-[#778DA9]/50 border border-[#415A77]/20 cursor-not-allowed select-none"
      >
        <span>Private Repo</span>
      </span>
    </div>
  </article>
</template>
