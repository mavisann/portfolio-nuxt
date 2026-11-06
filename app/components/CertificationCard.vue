<script setup lang="ts">
import { computed } from 'vue'
import type { Certification } from '~~/shared/types'

const props = defineProps<{
  certificate?: Certification
  title?: string
  subtitle?: string
  issuer?: string
  date?: string
  imageUrl?: string
  certificateUrl?: string
  verifyLink?: string
}>()

const emit = defineEmits<{
  (e: 'openCertificate', cert: Certification): void
}>()

// Support either full certificate object or individual props
const certTitle = computed(() => props.certificate?.title || props.title || 'Certification Title')
const certSubtitle = computed(() => props.certificate?.subtitle || props.subtitle || '')
const certIssuer = computed(() => props.certificate?.issuer || props.issuer || 'Official Issuer')
const certDate = computed(() => props.certificate?.date || props.date || '')
const certImage = computed(() => props.certificate?.imageUrl || props.imageUrl || '')
const certLink = computed(() => props.certificate?.verifyLink || props.verifyLink || '#')
const certCategory = computed(() => props.certificate?.category || 'Professional Certification')
const certDocUrl = computed(() => props.certificate?.certificateUrl || props.certificateUrl || '')

// Badge is clickable when certificateUrl is available (Professional Certification)
const isClickable = computed(() => !!certDocUrl.value)

const handleClick = () => {
  if (isClickable.value && props.certificate) {
    emit('openCertificate', props.certificate)
  }
}
</script>

<template>
  <div
    class="group bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 hover:border-[#778DA9]/60 rounded-3xl p-5 shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between gap-4"
  >
    <!-- 1. Top Image / Badge Frame -->
    <div
      class="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-br from-[#0D1B2A] to-[#1B263B] border border-[#415A77]/30 flex items-center justify-center shadow-inner select-none"
      :class="isClickable ? 'cursor-pointer group/badge' : ''"
      :tabindex="isClickable ? 0 : undefined"
      :role="isClickable ? 'button' : undefined"
      :aria-label="isClickable ? 'Click to view full ' + certTitle + ' certificate' : undefined"
      @click="handleClick"
      @keydown.enter="handleClick"
      @keydown.space.prevent="handleClick"
    >
      <!-- Badge Image (centered & proportioned) -->
      <img
        v-if="certImage"
        :src="certImage"
        :alt="certTitle"
        class="max-h-[82%] max-w-[82%] object-contain transition-transform duration-500 drop-shadow-md"
        :class="isClickable ? 'group-hover/badge:scale-110' : 'group-hover:scale-105'"
      />

      <!-- Fallback Stylized Certificate Banner with Deep Sea Gradients -->
      <div
        v-else
        class="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#0D1B2A] via-[#1B263B] to-[#0D1B2A] overflow-hidden"
      >
        <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#415A77]/30 blur-2xl pointer-events-none" />
        <div class="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-[#778DA9]/20 blur-2xl pointer-events-none" />

        <div
          class="w-12 h-12 rounded-2xl bg-[#415A77]/30 border border-[#778DA9]/40 flex items-center justify-center text-[#E0E1DD] shadow-lg mb-2 transition-transform duration-300 group-hover:scale-110"
        >
          <svg
            class="w-6 h-6 text-[#778DA9] group-hover:text-[#E0E1DD] transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <span class="text-[11px] uppercase font-bold tracking-widest text-[#778DA9] text-center px-2 truncate max-w-full">
          {{ certIssuer }}
        </span>
      </div>

      <!-- Category Pill Badge on top-right -->
      <span
        class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#0D1B2A]/85 border border-[#415A77]/50 text-[#E0E1DD] backdrop-blur-md shadow-md"
      >
        {{ certCategory === 'Professional Certification' ? 'Professional' : 'Course' }}
      </span>

      <!-- Click-to-view Certificate Hover Overlay -->
      <div
        v-if="isClickable"
        class="absolute inset-0 bg-[#0D1B2A]/40 backdrop-blur-[2px] opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 pointer-events-none"
      >
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1B263B]/95 border border-[#415A77]/70 text-xs font-semibold text-[#E0E1DD] shadow-xl"
        >
          <svg class="w-3.5 h-3.5 text-[#778DA9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>View Certificate</span>
        </span>
      </div>
    </div>

    <!-- 2. Middle Content: Title and Subtitle -->
    <div class="space-y-2 flex-1">
      <h3
        class="text-base sm:text-lg font-serif font-bold text-[#E0E1DD] leading-snug group-hover:text-white transition-colors line-clamp-2"
      >
        {{ certTitle }}
      </h3>
      <p v-if="certSubtitle" class="text-xs text-[#CED4DA] line-clamp-3 leading-relaxed">
        {{ certSubtitle }}
      </p>
    </div>

    <!-- 3. Divider & Metadata: Issuer & Date -->
    <div class="space-y-3 pt-2">
      <div class="border-t border-[#415A77]/25" />

      <div class="flex items-center justify-between text-xs text-[#778DA9]">
        <!-- Issuer with building icon -->
        <div class="flex items-center gap-1.5 font-mono truncate max-w-[60%]">
          <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span class="truncate">{{ certIssuer }}</span>
        </div>

        <!-- Date with calendar icon -->
        <div class="flex items-center gap-1.5 font-mono flex-shrink-0">
          <svg class="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{{ certDate }}</span>
        </div>
      </div>

      <!-- 4. Bottom Action: Verify Certificate Button -->
      <a
        :href="certLink"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-sm w-full rounded-xl bg-[#415A77] hover:bg-[#778DA9] text-white border-0 shadow-md flex items-center justify-center gap-1.5 transition-all duration-200"
      >
        <span>Verify Certificate</span>
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M7 17L17 7M17 7H7M17 7V17" />
        </svg>
      </a>
    </div>
  </div>
</template>
