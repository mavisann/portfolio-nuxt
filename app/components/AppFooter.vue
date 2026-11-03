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
  <footer class="relative z-10 mt-auto w-full pt-8 pb-8 px-6 text-[#CED4DA]">
    <div class="max-w-6xl mx-auto flex flex-col items-center">
      
      <!-- Full-Width Horizontal Divider Line (Deep Sea Steel) -->
      <div class="w-full h-px bg-gradient-to-r from-transparent via-[#415A77]/50 to-transparent mb-6" />

      <!-- Bottom Bar: Copyright & Live Philippine Clock (High Legibility) -->
      <div class="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs tracking-wider">
        <!-- Bottom Left -->
        <div class="font-semibold text-[#CED4DA] flex items-center gap-2">
          <span>PRINCE SEMILLANO &copy; 2026</span>
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
        </div>

        <!-- Bottom Right: Live Updating Digital Clock (No blue background) -->
        <div class="font-mono text-[#ADB5BD] flex items-center gap-2">
          <span>NAIC, CAVITE, PHILIPPINES &mdash;</span>
          <span class="text-[#E0E1DD] font-bold tracking-widest px-2.5 py-1 rounded-md border border-[#415A77]/40">
            {{ currentTime || '12:00:00 AM' }} PHT
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>
