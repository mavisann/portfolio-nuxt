<script setup lang="ts">
import { provide } from 'vue'
import { cn } from '~/lib/utils'

interface AccordionItemProps {
  value: string
  class?: string
}

const props = defineProps<AccordionItemProps>()

provide('accordion-item-value', props.value)
</script>

<template>
  <div
    :class="
      cn(
        'bg-[#1B263B]/60 backdrop-blur-xl border border-[#415A77]/40 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden',
        props.class
      )
    "
  >
    <slot />
  </div>
</template>

