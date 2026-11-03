<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Shader, InkFlow } from 'shaders/vue'

const scrollY = ref(0)
let ticking = false

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      scrollY.value = window.scrollY
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

const onShaderReady = () => {
  // WebGPU shader initialized
}

const onShaderUnavailable = (reason: unknown) => {
  console.warn('[Shaders] WebGPU unavailable:', reason)
}
</script>

<template>
  <div class="relative min-h-screen text-base-content overflow-x-hidden selection:bg-pink-500/30 selection:text-white">
    <NuxtRouteAnnouncer />

    <!-- Fullscreen Parallax Shader Background (drifts on scroll with 3D depth) -->
    <div
      class="fixed -top-[20vh] -left-[10vw] w-[120vw] h-[140vh] z-0 pointer-events-none overflow-hidden will-change-transform"
      :style="{
        transform: `translate3d(0, ${-scrollY * 0.2}px, 0)`,
        transition: 'transform 0.1s cubic-bezier(0,0,0.2,1)',
      }"
    >
      <ClientOnly>
        <Shader
          class="w-full h-full"
          @ready="onShaderReady"
          @unavailable="onShaderUnavailable"
        >
          <InkFlow
            color="#ff2d7e"
            :radius="0.3"
          />
        </Shader>
      </ClientOnly>
    </div>

    <!-- Application Pages & Frosted Glass Content (Z-index: 10) -->
    <div class="relative z-10 min-h-screen pointer-events-auto flex flex-col">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<style>
html,
body {
  background-color: #0f172a !important;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.shader,
.shader canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
