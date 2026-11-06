<script setup lang="ts">
defineProps<{
  title: string
  fullName?: string
  imageSrc: string
}>()
</script>

<template>
  <div class="group relative bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-md transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800 flex flex-col items-center w-44">
    <!-- Image Box with Frosted Background -->
    <div class="overflow-hidden rounded-xl cursor-zoom-in w-32 h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50">
      <!-- Hover Pop-Up Overlay (Full Card Coverage) -->
      <div class="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 rounded-2xl backdrop-blur-md opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <span class="text-sm font-black text-gray-900 dark:text-white text-center px-2 leading-tight">
          {{ fullName || title }}
        </span>
        <div class="w-8 h-1 bg-indigo-500 mt-1 rounded-full" />
      </div>

      <!-- Tech Logo Image -->
      <img
        :src="imageSrc"
        :alt="title"
        class="max-w-[70%] max-h-[70%] object-contain transition-transform duration-500 group-hover:scale-110"
      />
    </div>

    <!-- Tech Title -->
    <div class="mt-4">
      <h3 class="text-lg font-bold text-center text-gray-900 dark:text-white">
        <a href="#" class="" @click.prevent>{{ title }}</a>
      </h3>
    </div>
  </div>
</template>
