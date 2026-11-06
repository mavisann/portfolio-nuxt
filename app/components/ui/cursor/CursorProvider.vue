<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted, watch } from 'vue'
import { CURSOR_CONTEXT_KEY } from './keys'
import type { CursorContext } from './types'

const props = withDefaults(
  defineProps<{
    global?: boolean | string
  }>(),
  {
    global: false,
  },
)

const isGlobal = computed(() => props.global === true || props.global === 'true')

const x = ref(-200)
const y = ref(-200)
const isInside = ref(false)
const isDown = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const context: CursorContext = {
  x,
  y,
  isInside,
  isDown,
  isGlobal,
  containerRef,
}

provide(CURSOR_CONTEXT_KEY, context)

function onPointerMove(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  x.value = e.clientX
  y.value = e.clientY
  isInside.value = true
}

function onMouseMove(e: MouseEvent) {
  x.value = e.clientX
  y.value = e.clientY
  isInside.value = true
}

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  isDown.value = true
}

function onPointerUp(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  isDown.value = false
}

function onPointerLeave(e: MouseEvent) {
  if (!e.relatedTarget && (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
    isInside.value = false
  }
}

function onPointerEnter(e: PointerEvent) {
  if (e.pointerType === 'touch') return
  x.value = e.clientX
  y.value = e.clientY
  isInside.value = true
}

function updateCursorClass() {
  if (typeof document === 'undefined') return
  if (isGlobal.value && isInside.value) {
    document.documentElement.classList.add('has-custom-cursor')
  } else {
    document.documentElement.classList.remove('has-custom-cursor')
  }
}

watch([isGlobal, isInside], updateCursorClass)

onMounted(() => {
  if (typeof window === 'undefined') return

  if (isGlobal.value) {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointerenter', onPointerEnter)
    document.addEventListener('mouseleave', onPointerLeave)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('pointerdown', onPointerDown)
    window.removeEventListener('pointerup', onPointerUp)
    window.removeEventListener('pointerenter', onPointerEnter)
    document.removeEventListener('mouseleave', onPointerLeave)
    document.documentElement.classList.remove('has-custom-cursor')
  }
})
</script>

<template>
  <slot />
</template>
