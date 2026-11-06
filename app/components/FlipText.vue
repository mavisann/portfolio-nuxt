<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils'

export interface FlipTextProps {
  /**
   * Additional CSS classes for the wrapper
   */
  className?: string

  /**
   * The text content to animate (will be split by spaces)
   */
  children?: string

  /**
   * Vue prop alias for children
   */
  text?: string

  /**
   * Duration of the flip animation in seconds
   * @default 2.2
   */
  duration?: number

  /**
   * Initial delay before animation starts in seconds
   * @default 0
   */
  delay?: number

  /**
   * Whether the animation should loop infinitely
   * @default true
   */
  loop?: boolean

  /**
   * Custom separator for splitting text (default is space)
   * @default " "
   */
  separator?: string

  /**
   * Whether all characters should animate together (no stagger)
   * @default false
   */
  together?: boolean
}

const props = withDefaults(defineProps<FlipTextProps>(), {
  className: '',
  children: '',
  text: '',
  duration: 2.2,
  delay: 0,
  loop: true,
  separator: ' ',
  together: false,
})

const slots = useSlots()

const content = computed(() => {
  if (props.children) return props.children
  if (props.text) return props.text
  if (slots.default) {
    const vnodes = slots.default()
    const extracted = vnodes
      .map((vnode) => (typeof vnode.children === 'string' ? vnode.children : ''))
      .join('')
    if (extracted) return extracted
  }
  return ''
})

const words = computed(() => content.value.split(props.separator))
const totalChars = computed(() => content.value.length || 1)

// Calculate character index for each position
const getCharIndex = (wordIndex: number, charIndex: number) => {
  let index = 0
  for (let i = 0; i < wordIndex; i++) {
    index += (words.value[i]?.length || 0) + (props.separator === ' ' ? 1 : props.separator.length)
  }
  return index + charIndex
}

const getCalculatedDelay = (wordIndex: number, charIndex: number) => {
  let calculatedDelay = props.delay
  if (!props.together) {
    const currentGlobalIndex = getCharIndex(wordIndex, charIndex)
    const normalizedIndex = currentGlobalIndex / totalChars.value
    const sineValue = Math.sin(normalizedIndex * (Math.PI / 2))
    calculatedDelay = sineValue * (props.duration * 0.25) + props.delay
  }
  return calculatedDelay
}
</script>

<template>
  <div
    :class="cn('flip-text-wrapper inline-block leading-none', className)"
    style="perspective: 1000px;"
  >
    <span
      v-for="(word, wordIndex) in words"
      :key="wordIndex"
      class="word inline-block whitespace-nowrap"
      style="transform-style: preserve-3d;"
    >
      <span
        v-for="(char, charIndex) in word.split('')"
        :key="charIndex"
        class="flip-char inline-block relative"
        :data-char="char"
        :style="{
          '--flip-duration': `${props.duration}s`,
          '--flip-delay': `${getCalculatedDelay(wordIndex, charIndex)}s`,
          '--flip-iteration': props.loop ? 'infinite' : '1',
          transformStyle: 'preserve-3d',
        }"
      >
        {{ char }}
      </span>

      <span
        v-if="separator === ' ' && wordIndex < words.length - 1"
        class="whitespace inline-block"
      >&nbsp;</span>
      <span
        v-else-if="separator !== ' ' && wordIndex < words.length - 1"
        class="separator inline-block"
      >{{ separator }}</span>
    </span>
  </div>
</template>

<style scoped>
@keyframes flip-char {
  0%, 20% {
    transform: rotateX(0deg);
  }
  50% {
    transform: rotateX(180deg);
  }
  80%, 100% {
    transform: rotateX(360deg);
  }
}

.flip-char {
  display: inline-block;
  position: relative;
  transform-style: preserve-3d;
  animation-name: flip-char;
  animation-duration: var(--flip-duration, 2.2s);
  animation-delay: var(--flip-delay, 0s);
  animation-iteration-count: var(--flip-iteration, infinite);
  animation-timing-function: cubic-bezier(0.45, 0.05, 0.55, 0.95);
  backface-visibility: hidden;
  will-change: transform;
}
</style>
