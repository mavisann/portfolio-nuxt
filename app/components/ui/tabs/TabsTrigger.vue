<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import { cn } from '~/lib/utils'

interface TabsTriggerProps {
  value: string
  disabled?: boolean
  class?: string
}

const props = defineProps<TabsTriggerProps>()

const activeTab = inject<Ref<string>>('tabs-active')
const setTab = inject<(val: string) => void>('tabs-set')

const isActive = computed(() => activeTab?.value === props.value)
</script>

<template>
  <button
    type="button"
    role="tab"
    :aria-selected="isActive"
    :disabled="disabled"
    :data-state="isActive ? 'active' : 'inactive'"
    :class="
      cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-full px-5 py-2 text-xs font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#778DA9] disabled:pointer-events-none disabled:opacity-50 cursor-pointer z-10',
        isActive
          ? 'text-white'
          : 'text-[#CED4DA] hover:text-[#E0E1DD]',
        props.class
      )
    "
    @click="setTab?.(props.value)"
  >
    <!-- Smooth Pill Background -->
    <span
      v-if="isActive"
      class="absolute inset-0 rounded-full bg-[#415A77] shadow-md -z-10 transition-all duration-300"
    />
    <slot />
  </button>
</template>

