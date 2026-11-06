<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <h3 :class="cn('text-xl font-serif font-bold text-[#E0E1DD] tracking-wide leading-none', props.class)">
    <slot />
  </h3>
</template>

