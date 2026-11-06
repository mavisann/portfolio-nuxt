<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import { cn } from '~/lib/utils'

interface AccordionTriggerProps {
  class?: string
}

const props = defineProps<AccordionTriggerProps>()

const itemValue = inject<string>('accordion-item-value', '')
const openItems = inject<Ref<string[]>>('accordion-open-items')
const toggle = inject<(val: string) => void>('accordion-toggle')

const isOpen = computed(() => openItems?.value.includes(itemValue) ?? false)
</script>

<template>
  <button
    type="button"
    :aria-expanded="isOpen"
    :class="
      cn(
        'w-full flex items-center justify-between p-5 sm:p-6 text-left cursor-pointer transition-colors duration-200 hover:bg-[#415A77]/10',
        props.class
      )
    "
    @click="toggle?.(itemValue)"
  >
    <div class="flex items-center gap-3 sm:gap-4 flex-1">
      <slot :is-open="isOpen" />
    </div>

    <!-- Chevron Indicator with 180deg Rotation on Open -->
    <div
      class="w-8 h-8 rounded-full bg-[#0D1B2A]/60 border border-[#415A77]/30 flex items-center justify-center text-[#778DA9] transition-transform duration-300 flex-shrink-0 ml-3"
      :class="isOpen ? 'rotate-180 text-[#E0E1DD]' : 'rotate-0'"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  </button>
</template>

