<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <p :class="cn('text-xs text-[#CED4DA] leading-relaxed', props.class)">
    <slot />
  </p>
</template>

