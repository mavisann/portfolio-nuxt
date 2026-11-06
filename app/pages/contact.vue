<script setup lang="ts">
import { ref } from 'vue'
import type { ContactMethod } from '~~/shared/types'
import { Effects } from '@/components/ui/effects'
import ContactDialog from '~/components/ContactDialog.vue'

// Page-level SEO Metadata
usePortfolioSeo({
  title: 'Contact — Prince Semillano',
  description:
    "Let's build something that lasts. Get in touch with Prince Semillano for full-stack development, AI applications, APIs, and software engineering collaborations.",
})

// Structured List of Contact Methods
const contactMethods = ref<ContactMethod[]>([
  {
    type: 'EMAIL',
    value: 'prince.semillanoquilantang@gmail.com',
    link: 'mailto:prince.semillanoquilantang@gmail.com',
    icon: 'mail',
  },
  {
    type: 'GITHUB',
    value: 'github.com/mavisann',
    link: 'https://github.com/mavisann',
    icon: 'github',
  },
  {
    type: 'LINKEDIN',
    value: 'linkedin.com/in/mavisan07',
    link: 'https://www.linkedin.com/in/mavisan07/',
    icon: 'linkedin',
  },
])

// Copy to Clipboard notification state
const copiedValue = ref<string | null>(null)

const handleCopy = async (val: string) => {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(val)
      copiedValue.value = val
      setTimeout(() => {
        copiedValue.value = null
      }, 2000)
    } catch {
      // Fallback
    }
  }
}
</script>

<template>
  <div class="space-y-10 text-[#E0E1DD] max-w-6xl mx-auto">
    <!-- Main Two-Column Starfield Container -->
    <div
      class="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden min-h-[640px]"
    >
      <!-- ─── Left Column (Starfield Background, Content & Contact List) ─── -->
      <section
        class="lg:col-span-7 relative p-8 sm:p-12 lg:p-16 flex flex-col justify-between overflow-hidden"
      >
        <!-- Upper Content Block -->
        <div class="relative z-10 space-y-6">
          <!-- Hero Headline -->
          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#E0E1DD] leading-[1.12]"
          >
            Let's build something <span class="text-teal-400">that lasts.</span>
          </h1>
          <!-- Status Pill -->
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1B263B]/80 border border-[#415A77]/40 text-xs text-[#CED4DA] font-medium backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Open for Opportunities & Projects</span>
          </div>
          <!-- Description Paragraph -->
          <p class="text-sm sm:text-base text-[#CED4DA] max-w-lg leading-relaxed font-normal">
            Full-stack, AI, APIs, bots, or automation — if it needs to actually work, let's talk. Based in Cavite, Philippines, working with teams everywhere.
          </p>

          <!-- Interactive "Get in touch" Form Dialog Trigger Button -->
          <div class="pt-2">
            <ContactDialog
              from="top"
              button-variant="teal"
              button-size="lg"
              button-text="Get in touch"
              button-class="rounded-full shadow-[0_0_20px_rgba(45,212,191,0.25)] hover:shadow-[0_0_28px_rgba(45,212,191,0.4)] px-6 text-sm font-bold"
            />
          </div>
        </div>

        <!-- Divider with Margin -->
        <div class="relative z-10 mt-10 lg:mt-12">
          <div class="h-px bg-gradient-to-r from-transparent via-[#415A77]/40 to-transparent" />
        </div>

        <!-- Contact List (Grid Rows with Hover Translations & Direct Links) -->
        <div class="relative z-10 mt-6">
          <Effects :hold-delay="70" class="divide-y divide-[#415A77]/20">
            <div
              v-for="item in contactMethods"
              :key="item.type"
              class="group flex items-center gap-3.5 sm:gap-4 py-4 px-2 sm:px-3 rounded-2xl hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
            >
              <!-- Icon Container -->
              <div
                class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1B263B]/90 border border-[#415A77]/40 flex items-center justify-center text-[#778DA9] group-hover:text-teal-400 group-hover:border-teal-400/50 group-hover:shadow-[0_0_12px_rgba(45,212,191,0.25)] transition-all shrink-0"
              >
                <!-- Email Icon -->
                <svg
                  v-if="item.icon === 'mail'"
                  class="w-4 h-4 sm:w-4.5 sm:h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>

                <!-- GitHub Icon -->
                <svg
                  v-else-if="item.icon === 'github'"
                  class="w-4 h-4 sm:w-4.5 sm:h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>

                <!-- LinkedIn Icon -->
                <svg
                  v-else-if="item.icon === 'linkedin'"
                  class="w-4 h-4 sm:w-4.5 sm:h-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>

              <!-- Label Type (uppercase font-mono) -->
              <span class="text-[10px] font-bold text-[#778DA9] uppercase tracking-widest w-20 sm:w-24 shrink-0 font-mono">
                {{ item.type }}
              </span>

              <!-- Value Link (Open directly or click) -->
              <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-xs sm:text-sm font-medium text-[#E0E1DD] group-hover:text-white transition-colors truncate flex-1 hover:underline underline-offset-4 decoration-[#415A77]"
              >
                {{ item.value }}
              </a>

              <!-- Copy Value Button -->
              <button
                type="button"
                class="px-2 py-1 rounded-lg text-[10px] font-mono text-[#778DA9] hover:text-white hover:bg-[#1B263B] transition-colors shrink-0"
                :title="'Copy ' + item.value"
                @click.stop="handleCopy(item.value)"
              >
                <span v-if="copiedValue === item.value" class="text-teal-400 font-bold">Copied!</span>
                <span v-else class="opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
              </button>

              <!-- Animated Arrow Hover Indicator -->
              <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                class="p-1 text-teal-400 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0 shrink-0"
                :aria-label="'Go to ' + item.type"
              >
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          </Effects>
        </div>
      </section>
    </div>
  </div>
</template>
