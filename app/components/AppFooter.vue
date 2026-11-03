<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')
let timer: ReturnType<typeof setInterval> | null = null

const updateClock = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Manila',
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <footer class="relative z-10 mt-auto w-full pt-16 pb-8 px-6 text-base-content/80">
    <div class="max-w-6xl mx-auto flex flex-col items-center">
      <!-- Top Section: Centered Blockquote Quote -->
      <div class="flex flex-col items-center text-center gap-3 mb-12 max-w-xl mx-auto">
        <!-- Manual Blockquote SVG Icon -->
        <div class="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 opacity-80"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <!-- Stylized Serif Quote -->
        <blockquote class="font-serif italic text-2xl md:text-3xl text-white tracking-wide">
          &ldquo;fake it,&rsquo;til you make it&rdquo;
        </blockquote>
        <p class="text-xs uppercase tracking-widest text-base-content/50 font-medium">
          Personal Creed &bull; Continuous Evolution
        </p>
      </div>

      <!-- Full-Width Horizontal Divider -->
      <div class="w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent mb-6" />

      <!-- Bottom Bar -->
      <div class="w-full flex flex-col md:flex-row items-center justify-between gap-3 text-xs tracking-wider">
        <!-- Bottom Left -->
        <div class="font-semibold text-base-content/70 flex items-center gap-2">
          <span>PRINCE SEMILLANO &copy; 2026</span>
          <span class="inline-block w-1 h-1 rounded-full bg-teal-400 animate-ping" />
        </div>

        <!-- Bottom Right: Live Digital Clock -->
        <div class="font-mono text-base-content/75 flex items-center gap-2">
          <span>NAIC, CAVITE, PHILIPPINES &mdash;</span>
          <span class="text-teal-300 font-bold tracking-widest bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            {{ currentTime || '12:00:00 AM' }} PHT
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
