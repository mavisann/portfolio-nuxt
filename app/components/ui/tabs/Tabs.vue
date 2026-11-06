<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { cn } from '~/lib/utils'

interface TabsProps {
  defaultValue?: string
  modelValue?: string
  class?: string
}

const props = withDefaults(defineProps<TabsProps>(), {})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const activeTab = ref<string>(props.modelValue ?? props.defaultValue ?? '')

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined && val !== activeTab.value) {
      activeTab.value = val
    }
  }
)

function setTab(value: string) {
  activeTab.value = value
  emit('update:modelValue', value)
}

provide('tabs-active', activeTab)
provide('tabs-set', setTab)
</script>

<template>
  <div :class="cn('w-full', props.class)">
    <slot />
  </div>
</template>

