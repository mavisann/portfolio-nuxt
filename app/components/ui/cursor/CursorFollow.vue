<script setup lang="ts">
import { ref, computed, inject, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { CURSOR_CONTEXT_KEY } from './keys'
import type { CursorFollowSide, CursorFollowAlign } from './types'

const props = withDefaults(
  defineProps<{
    side?: CursorFollowSide
    sideOffset?: number | string
    align?: CursorFollowAlign
    alignOffset?: number | string
    class?: string
  }>(),
  {
    side: 'bottom',
    sideOffset: 15,
    align: 'end',
    alignOffset: 5,
  },
)

const ctx = inject(CURSOR_CONTEXT_KEY, null)
const elRef = ref<HTMLElement | null>(null)

const elWidth = ref(120)
const elHeight = ref(28)

const currentX = ref(-300)
const currentY = ref(-300)

let rafId: number | null = null
let resizeObserver: ResizeObserver | null = null

const isVisible = computed(() => Boolean(ctx?.isInside.value))

function updateSize() {
  if (!elRef.value) return
  const rect = elRef.value.getBoundingClientRect()
  if (rect.width > 0) elWidth.value = rect.width
  if (rect.height > 0) elHeight.value = rect.height
}

function calculateTarget() {
  if (!ctx) return { x: 0, y: 0 }
  const cx = ctx.x.value
  const cy = ctx.y.value
  const w = elWidth.value
  const h = elHeight.value
  const sOff = Number(props.sideOffset) || 15
  const aOff = Number(props.alignOffset) || 5

  // Cursor arrow dimensions (20px width x 24px height, tip at 0,0)
  const cursorW = 15
  const cursorH = 17

  let tx = cx
  let ty = cy

  switch (props.side) {
    case 'top':
      ty = cy - h - sOff
      if (props.align === 'start') tx = cx - w - aOff
      else if (props.align === 'center') tx = cx - w / 2
      else tx = cx + cursorW + aOff
      break

    case 'bottom':
      // Aligns right below the cursor arrow tail (dx = 20px, dy = 32px from tip)
      ty = cy + cursorH + sOff
      if (props.align === 'start') tx = cx - w - aOff
      else if (props.align === 'center') tx = cx - w / 2
      else tx = cx + cursorW + aOff // 'end'
      break

    case 'left':
      tx = cx - w - sOff
      if (props.align === 'start') ty = cy - h - aOff
      else if (props.align === 'center') ty = cy - h / 2
      else ty = cy + cursorH + aOff
      break

    case 'right':
      tx = cx + cursorW + sOff
      if (props.align === 'start') ty = cy - h - aOff
      else if (props.align === 'center') ty = cy - h / 2
      else ty = cy + cursorH + aOff
      break
  }

  return { x: tx, y: ty }
}

function tick() {
  const target = calculateTarget()

  // Snap immediately on first initialization
  if (currentX.value < -200) {
    currentX.value = target.x
    currentY.value = target.y
  } else {
    // Smooth lerp trailing physics
    const factor = 0.2
    currentX.value += (target.x - currentX.value) * factor
    currentY.value += (target.y - currentY.value) * factor
  }

  rafId = requestAnimationFrame(tick)
}

watch(isVisible, (visible) => {
  if (visible) {
    const target = calculateTarget()
    currentX.value = target.x
    currentY.value = target.y
  }
})

const style = computed(() => {
  const scale = isVisible.value ? 1 : 0
  const opacity = isVisible.value ? 1 : 0

  return {
    transform: `translate3d(${currentX.value}px, ${currentY.value}px, 0) scale(${scale})`,
    transformOrigin: '0 0',
    opacity,
  }
})

onMounted(() => {
  nextTick(() => {
    updateSize()
    if (elRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateSize()
      })
      resizeObserver.observe(elRef.value)
    }
    rafId = requestAnimationFrame(tick)
  })
})

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})
</script>

<template>
  <div
    ref="elRef"
    :class="[
      'fixed top-0 left-0 pointer-events-none z-[9998] select-none will-change-transform transition-[opacity,scale] duration-150 ease-out drop-shadow-md',
      props.class,
    ]"
    :style="style"
    aria-hidden="true"
  >
    <slot />
  </div>
</template>
