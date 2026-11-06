<script setup lang="ts">
import { inject } from 'vue'

defineProps<{
  asChild?: boolean
}>()

const setOpen = inject<(val: boolean) => void>('dialog-set-open')

const handleClick = () => {
  setOpen?.(false)
}
</script>

<template>
  <div class="contents" @click="handleClick">
    <slot />
  </div>
</template>

