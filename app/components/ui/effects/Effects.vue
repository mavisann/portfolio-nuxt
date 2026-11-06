<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

interface EffectsProps {
  delay?: number | string
  holdDelay?: number | string
  blur?: boolean | string
  slide?: boolean | string
  fade?: boolean | string
  zoom?: boolean | string
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  class?: string
  as?: string
}

const props = withDefaults(defineProps<EffectsProps>(), {
  delay: 0,
  holdDelay: 100,
  blur: true,
  slide: true,
  fade: true,
  zoom: true,
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
  triggerOnce: true,
  as: 'div',
})

const containerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null
let mutationObserver: MutationObserver | null = null

const shouldBlur = computed(() => props.blur === true || props.blur === 'true')
const shouldSlide = computed(() => props.slide === true || props.slide === 'true')
const shouldFade = computed(() => props.fade === true || props.fade === 'true')
const shouldZoom = computed(() => props.zoom === true || props.zoom === 'true')

const fromFilter = computed(() => (shouldBlur.value ? 'blur(10px)' : 'blur(0px)'))
const fromOpacity = computed(() => (shouldFade.value ? '0' : '1'))
const fromTransform = computed(() => {
  if (shouldSlide.value && shouldZoom.value) return 'translateY(28px) scale(0.92)'
  if (shouldSlide.value) return 'translateY(28px)'
  if (shouldZoom.value) return 'scale(0.92)'
  return 'none'
})

function applyStaggerDelays() {
  if (!containerRef.value) return
  const children = Array.from(containerRef.value.children) as HTMLElement[]
  const baseDelay = Number(props.delay) || 0
  const hold = Number(props.holdDelay) || 100

  children.forEach((child, index) => {
    child.style.setProperty('--effect-delay', `${baseDelay + index * hold}ms`)
    child.style.setProperty('--from-filter', fromFilter.value)
    child.style.setProperty('--from-opacity', fromOpacity.value)
    child.style.setProperty('--from-transform', fromTransform.value)
  })
}

function initObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    isVisible.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (props.triggerOnce && observer && containerRef.value) {
            observer.unobserve(containerRef.value)
          }
        } else if (!props.triggerOnce) {
          isVisible.value = false
        }
      }
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin,
    }
  )

  if (containerRef.value) {
    observer.observe(containerRef.value)
  }
}

onMounted(() => {
  nextTick(() => {
    applyStaggerDelays()
    initObserver()

    if (containerRef.value && typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        applyStaggerDelays()
      })
      mutationObserver.observe(containerRef.value, { childList: true })
    }
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (mutationObserver) {
    mutationObserver.disconnect()
    mutationObserver = null
  }
})
</script>

<template>
  <div
    ref="containerRef"
    :class="[
      'animate-effects-container',
      props.class,
      isVisible ? 'is-visible' : 'is-idle',
    ]"
  >
    <slot />
  </div>
</template>

<style scoped>
.animate-effects-container {
  --effect-duration: 0.65s;
  --effect-easing: cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-effects-container.is-idle > :deep(*) {
  opacity: var(--from-opacity, 0);
  filter: var(--from-filter, blur(10px));
  transform: var(--from-transform, translateY(28px) scale(0.92));
  will-change: opacity, transform, filter;
}

.animate-effects-container.is-visible > :deep(*) {
  animation: effect-reveal var(--effect-duration) var(--effect-easing) both;
  animation-delay: var(--effect-delay, 0ms);
  will-change: opacity, transform, filter;
}

@keyframes effect-reveal {
  0% {
    opacity: var(--from-opacity, 0);
    filter: var(--from-filter, blur(10px));
    transform: var(--from-transform, translateY(28px) scale(0.92));
  }
  100% {
    opacity: 1;
    filter: blur(0px);
    transform: translateY(0px) scale(1);
  }
}
</style>

