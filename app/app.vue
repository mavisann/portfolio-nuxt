<script setup lang="ts">
import { Shader, InkFlow } from 'shaders/vue'

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

    <!-- Fullscreen Shader Background (Locked to 100% of viewport — no scroll cutoffs) -->
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

    <!-- Global Animated Custom Cursor -->
    <ClientOnly>
      <AppCursor :global="true" />
    </ClientOnly>

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
  background-color: #0D1B2A !important;
  color: #E0E1DD !important;
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

/* Custom Cursor: hide default cursor only when custom cursor is active on fine-pointer (mouse) devices */
@media (pointer: fine) {
  html.has-custom-cursor,
  html.has-custom-cursor * {
    cursor: none !important;
  }
}
</style>
