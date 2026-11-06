<script setup lang="ts">
import { inject, type Ref } from 'vue'

defineProps<{
  asChild?: boolean
}>()

const setOpen = inject<(val: boolean) => void>('dialog-set-open')

const handleClick = (e: MouseEvent) => {
  setOpen?.(true)
}
</script>

<template>
  <div class="contents" @click="handleClick">
    <slot />
  </div>
</template>

