<script setup lang="ts">
import { provide, ref, watch } from 'vue'
import { cn } from '~/lib/utils'

interface AccordionProps {
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
  modelValue?: string | string[]
  class?: string
}

const props = withDefaults(defineProps<AccordionProps>(), {
  type: 'single',
  collapsible: true,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void
}>()

const openItems = ref<string[]>(
  Array.isArray(props.modelValue ?? props.defaultValue)
    ? (props.modelValue ?? props.defaultValue as string[])
    : props.modelValue ?? props.defaultValue
      ? [props.modelValue ?? props.defaultValue as string]
      : []
)

watch(
  () => props.modelValue,
  (val) => {
    if (val !== undefined) {
      openItems.value = Array.isArray(val) ? val : [val]
    }
  }
)

function toggleItem(value: string) {
  if (props.type === 'single') {
    if (openItems.value.includes(value)) {
      openItems.value = props.collapsible ? [] : [value]
    } else {
      openItems.value = [value]
    }
  } else {
    if (openItems.value.includes(value)) {
      openItems.value = openItems.value.filter((i) => i !== value)
    } else {
      openItems.value.push(value)
    }
  }
  emit(
    'update:modelValue',
    props.type === 'single' ? (openItems.value[0] ?? '') : openItems.value
  )
}

provide('accordion-open-items', openItems)
provide('accordion-toggle', toggleItem)
</script>

<template>
  <div :class="cn('w-full space-y-4', props.class)">
    <slot />
  </div>
</template>

