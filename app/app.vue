<script setup lang="ts">
import { Shader, InkFlow } from 'shaders/vue'

const onShaderReady = () => {
  // WebGPU shader initialized and rendering
}

const onShaderUnavailable = (reason: unknown) => {
  console.warn('[Shaders] WebGPU not available in this browser:', reason)
}
</script>

<template>
  <div class="relative min-h-screen text-base-content overflow-x-hidden selection:bg-pink-500/30 selection:text-white">
    <NuxtRouteAnnouncer />

    <!-- Fullscreen Interactive Shader Background (Z-index: 0, above body #0f172a, below content z-10) -->
    <div class="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
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
    <div class="relative z-10 min-h-screen pointer-events-auto">
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

/* Ensure the shader element and canvas fill the fullscreen container */
.shader,
.shader canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
