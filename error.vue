<script setup lang="ts">
import type { NuxtError } from '#app'
import ErrorPage from './app/error.vue'

defineProps<{
  error?: NuxtError | Record<string, any>
}>()
</script>

<template>
  <ErrorPage :error="error" />
</template>

