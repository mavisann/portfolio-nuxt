<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import Canyon404 from '~/components/Canyon404.vue'
import AppCursor from '~/components/AppCursor.vue'

const props = defineProps<{
  error?: NuxtError | Record<string, any>
}>()

const statusCode = computed(() => props.error?.statusCode || 404)

const errorTitle = computed(() => {
  if (statusCode.value === 500) return 'System Crash'
  return props.error?.statusMessage || 'Not Found'
})

const errorSubtitle = computed(() => {
  if (statusCode.value === 500) {
    return "Our servers hit a cactus. We're working on it!"
  }
  return "Sorry, there's nothing to see here but cacti :("
})

const handleClearHome = () => {
  clearError({ redirect: '/' })
}

const handleClearProjects = () => {
  clearError({ redirect: '/projects' })
}

// Page Meta & SEO for Error View
useHead({
  title: `${statusCode.value} — Page ${errorTitle.value} | Prince Semillano`,
  meta: [
    {
      name: 'description',
      content:
        'The page you are looking for does not exist or an unexpected error occurred. Explore featured software projects and portfolios by Prince Semillano.',
    },
  ],
})
</script>

<template>
  <div class="relative min-h-screen bg-[#0D1B2A] text-[#E0E1DD] overflow-hidden">
    <!-- Global Custom Cursor on Error Page -->
    <ClientOnly>
      <AppCursor :global="true" />
    </ClientOnly>

    <!-- Interactive Canyon 404 Parallax Screen -->
    <Canyon404
      :error-code="statusCode"
      :title="errorTitle"
      :subtitle="errorSubtitle"
      home-text="go back home"
      search-text="explore projects"
      @home="handleClearHome"
      @search="handleClearProjects"
    />
  </div>
</template>

