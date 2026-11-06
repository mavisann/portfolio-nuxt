<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 gap-2.5 pt-5 border-t border-[#415A77]/30 mt-6',
        $props.class
      )
    "
  >
    <slot />
  </div>
</template>

