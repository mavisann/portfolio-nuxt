<script setup lang="ts">
import { inject, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { CURSOR_CONTEXT_KEY } from './keys'

const props = defineProps<{
  class?: string
  as?: string
}>()

const ctx = inject(CURSOR_CONTEXT_KEY, null)
const markerEl = ref<HTMLElement | null>(null)
let targetEl: HTMLElement | null = null

function onPointerMove(e: PointerEvent) {
  if (!ctx || ctx.isGlobal.value) return
  if (e.pointerType === 'touch') return
  ctx.x.value = e.clientX
  ctx.y.value = e.clientY
  ctx.isInside.value = true
  if (targetEl && !targetEl.classList.contains('cursor-none-active')) {
    targetEl.classList.add('cursor-none-active')
  }
}

function onPointerEnter(e: PointerEvent) {
  if (!ctx || ctx.isGlobal.value) return
  if (e.pointerType === 'touch') return
  ctx.x.value = e.clientX
  ctx.y.value = e.clientY
  ctx.isInside.value = true
  if (targetEl) {
    targetEl.classList.add('cursor-none-active')
  }
}

function onPointerLeave(e: PointerEvent) {
  if (!ctx || ctx.isGlobal.value) return
  // Ensure we didn't just move to an inner child
  if (targetEl && e.relatedTarget && targetEl.contains(e.relatedTarget as Node)) {
    return
  }
  ctx.isInside.value = false
  if (targetEl) {
    targetEl.classList.remove('cursor-none-active')
  }
}

function onPointerDown(e: PointerEvent) {
  if (!ctx || ctx.isGlobal.value) return
  if (e.pointerType === 'touch') return
  ctx.isDown.value = true
}

function onPointerUp(e: PointerEvent) {
  if (!ctx || ctx.isGlobal.value) return
  if (e.pointerType === 'touch') return
  ctx.isDown.value = false
}

onMounted(() => {
  nextTick(() => {
    if (!ctx || ctx.isGlobal.value) return

    targetEl = markerEl.value?.parentElement || null
    if (targetEl) {
      ctx.containerRef.value = targetEl
      targetEl.addEventListener('pointermove', onPointerMove, { passive: true })
      targetEl.addEventListener('pointerenter', onPointerEnter)
      targetEl.addEventListener('pointerleave', onPointerLeave)
      targetEl.addEventListener('pointerdown', onPointerDown)
      targetEl.addEventListener('pointerup', onPointerUp)
    }
  })
})

onUnmounted(() => {
  if (targetEl) {
    targetEl.removeEventListener('pointermove', onPointerMove)
    targetEl.removeEventListener('pointerenter', onPointerEnter)
    targetEl.removeEventListener('pointerleave', onPointerLeave)
    targetEl.removeEventListener('pointerdown', onPointerDown)
    targetEl.removeEventListener('pointerup', onPointerUp)
    targetEl.classList.remove('cursor-none-active')
    targetEl = null
  }
})
</script>

<template>
  <div ref="markerEl" class="contents" :class="props.class">
    <slot />
  </div>
</template>

<style>
.cursor-none-active,
.cursor-none-active * {
  cursor: none !important;
}
</style>
