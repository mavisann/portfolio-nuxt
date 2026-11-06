<script setup lang="ts">
import { inject, computed } from 'vue'
import { CURSOR_CONTEXT_KEY } from './keys'

const props = defineProps<{
  class?: string
}>()

const ctx = inject(CURSOR_CONTEXT_KEY, null)

const isVisible = computed(() => Boolean(ctx?.isInside.value))
const isPressed = computed(() => Boolean(ctx?.isDown.value))

const style = computed(() => {
  if (!ctx) return { display: 'none' }
  const x = ctx.x.value
  const y = ctx.y.value
  const scale = !isVisible.value ? 0 : isPressed.value ? 0.82 : 1
  const opacity = isVisible.value ? 1 : 0

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transformOrigin: '0 0',
    opacity,
  }
})
</script>

<template>
  <div
    :class="[
      'fixed top-0 left-0 pointer-events-none z-[99999] select-none will-change-transform drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)] transition-[opacity,scale] duration-150 ease-out',
      props.class,
    ]"
    :style="style"
    aria-hidden="true"
  >
    <slot />
  </div>
</template>
