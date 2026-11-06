<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <p
    :class="
      cn(
        'text-sm text-[#CED4DA] leading-relaxed font-normal',
        $props.class
      )
    "
  >
    <slot />
  </p>
</template>

