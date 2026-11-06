<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  for?: string
  class?: string
}>()
</script>

<template>
  <label
    :for="$props.for"
    :class="
      cn(
        'text-xs font-mono font-bold uppercase tracking-wider text-[#CED4DA] select-none block',
        $props.class
      )
    "
  >
    <slot />
  </label>
</template>

