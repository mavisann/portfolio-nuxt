<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <h2
    :class="
      cn(
        'text-2xl font-serif font-bold text-[#E0E1DD] tracking-tight leading-snug',
        $props.class
      )
    "
  >
    <slot />
  </h2>
</template>

