<script setup lang="ts">
import { inject, computed, type Ref } from 'vue'
import { cn } from '~/lib/utils'

interface TabsContentProps {
  value: string
  class?: string
}

const props = defineProps<TabsContentProps>()

const activeTab = inject<Ref<string>>('tabs-active')
const isActive = computed(() => activeTab?.value === props.value)
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-3.5 scale-[0.99]"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-[0.99]"
  >
    <div
      v-if="isActive"
      role="tabpanel"
      :data-state="isActive ? 'active' : 'inactive'"
      :class="
        cn(
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#778DA9]',
          props.class
        )
      "
    >
      <slot />
    </div>
  </Transition>
</template>

