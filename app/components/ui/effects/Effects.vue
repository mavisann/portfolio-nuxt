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
}

const props = withDefaults(defineProps<EffectsProps>(), {
  delay: 0,
  holdDelay: 100,
  blur: true,
  slide: true,
  fade: true,
  zoom: true,
  threshold: 0.08,
  rootMargin: '0px 0px -30px 0px',
  triggerOnce: true,
})

const containerRef = ref<HTMLElement | null>(null)
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

function observeChildren() {
  if (!containerRef.value) return
  const children = Array.from(containerRef.value.children) as HTMLElement[]
  const baseDelay = Number(props.delay) || 0
  const hold = Number(props.holdDelay) || 100

  children.forEach((child, index) => {
    child.classList.add('effect-item')
    // Pre-assign exact staggered delay based on sibling index
    child.style.setProperty('--effect-delay', `${baseDelay + index * hold}ms`)
    child.style.setProperty('--from-filter', fromFilter.value)
    child.style.setProperty('--from-opacity', fromOpacity.value)
    child.style.setProperty('--from-transform', fromTransform.value)

    if (observer) {
      observer.observe(child)
    } else {
      child.classList.add('is-revealed')
    }
  })
}

function initObserver() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    if (containerRef.value) {
      Array.from(containerRef.value.children).forEach((child) => {
        ;(child as HTMLElement).classList.add('is-revealed')
      })
    }
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.classList.add('is-revealed')

          if (props.triggerOnce && observer) {
            observer.unobserve(el)
          }
        } else if (!props.triggerOnce) {
          const el = entry.target as HTMLElement
          el.classList.remove('is-revealed')
        }
      }
    },
    {
      threshold: props.threshold,
      rootMargin: props.rootMargin,
    }
  )

  observeChildren()
}

onMounted(() => {
  nextTick(() => {
    initObserver()

    if (containerRef.value && typeof MutationObserver !== 'undefined') {
      mutationObserver = new MutationObserver(() => {
        observeChildren()
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
    :class="['animate-effects-container', props.class]"
  >
    <slot />
  </div>
</template>

<style scoped>
.animate-effects-container {
  --effect-duration: 0.65s;
  --effect-easing: cubic-bezier(0.16, 1, 0.3, 1);
}

.animate-effects-container > :deep(.effect-item) {
  opacity: var(--from-opacity, 0);
  filter: var(--from-filter, blur(10px));
  transform: var(--from-transform, translateY(28px) scale(0.92));
  will-change: opacity, transform, filter;
}

.animate-effects-container > :deep(.effect-item.is-revealed) {
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
