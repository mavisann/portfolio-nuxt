<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    :class="
      cn(
        'rounded-3xl border border-[#415A77]/40 bg-[#1B263B]/60 backdrop-blur-xl text-[#E0E1DD] shadow-2xl transition-all duration-300 hover:border-[#778DA9]/60 hover:shadow-2xl',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>

