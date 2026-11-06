<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import { cn } from '~/lib/utils'

interface AccordionContentProps {
  class?: string
}

const props = defineProps<AccordionContentProps>()

const itemValue = inject<string>('accordion-item-value', '')
const openItems = inject<Ref<string[]>>('accordion-open-items')

const isOpen = computed(() => openItems?.value.includes(itemValue) ?? false)
</script>

<template>
  <div
    class="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
    :class="isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'"
  >
    <div class="overflow-hidden min-h-0">
      <div :class="cn('px-5 pb-6 sm:px-6 sm:pb-7 pt-2 border-t border-[#415A77]/25', props.class)">
        <slot />
      </div>
    </div>
  </div>
</template>

