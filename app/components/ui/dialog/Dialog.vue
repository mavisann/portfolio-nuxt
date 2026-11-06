<script setup lang="ts">
import { ref, provide, watch, onUnmounted } from 'vue'

const props = withDefaults(
  defineProps<{
    open?: boolean
    defaultOpen?: boolean
  }>(),
  {
    open: undefined,
    defaultOpen: false,
  }
)

const emit = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const internalOpen = ref(props.defaultOpen)

const isOpen = ref(props.open !== undefined ? props.open : internalOpen.value)

watch(
  () => props.open,
  (val) => {
    if (val !== undefined) {
      isOpen.value = val
    }
  }
)

const setOpen = (val: boolean) => {
  isOpen.value = val
  internalOpen.value = val
  emit('update:open', val)
}

provide('dialog-is-open', isOpen)
provide('dialog-set-open', setOpen)

// Lock body scrolling when dialog is open
watch(isOpen, (val) => {
  if (typeof document !== 'undefined') {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div class="contents">
    <slot :open="isOpen" :set-open="setOpen" />
  </div>
</template>

