<script setup lang="ts">
import { cn } from '~/lib/utils'

interface TabsListProps {
  class?: string
}

const props = defineProps<TabsListProps>()
</script>

<template>
  <div
    role="tablist"
    :class="
      cn(
        'inline-flex items-center justify-center rounded-full bg-[#1B263B]/70 border border-[#415A77]/50 p-1.5 text-[#CED4DA] backdrop-blur-xl shadow-xl transition-all',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>

