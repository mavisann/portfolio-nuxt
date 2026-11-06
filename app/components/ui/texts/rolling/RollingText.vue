<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

export interface RollingTextProps {
  /** The text string to animate */
  text: string
  /** Delay in seconds before the animation begins @default 0 */
  delay?: number
  /** Duration of each character's roll animation in seconds @default 0.55 */
  duration?: number
  /** Stagger delay between characters in seconds @default 0.035 */
  stagger?: number
  /** Additional CSS classes */
  class?: string
}

const props = withDefaults(defineProps<RollingTextProps>(), {
  delay: 0,
  duration: 0.55,
  stagger: 0.035,
  class: '',
})

// Split text into words while keeping word integrity
const words = computed(() => {
  if (!props.text) return []
  return props.text.split(' ')
})

// Calculate global character index across all words
function getCharIndex(wordIdx: number, charIdx: number) {
  let idx = 0
  for (let w = 0; w < wordIdx; w++) {
    idx += words.value[w].length + 1
  }
  return idx + charIdx
}

function getCharDelay(wordIdx: number, charIdx: number) {
  const index = getCharIndex(wordIdx, charIdx)
  return props.delay + index * props.stagger
}
</script>

<template>
  <span
    :class="cn('rolling-text inline-flex flex-wrap items-baseline leading-tight select-none', props.class)"
    :aria-label="text"
  >
    <span
      v-for="(word, wordIdx) in words"
      :key="wordIdx"
      class="rolling-word inline-flex whitespace-nowrap"
      aria-hidden="true"
    >
      <span
        v-for="(char, charIdx) in word.split('')"
        :key="charIdx"
        class="rolling-char-container relative inline-block overflow-hidden align-baseline"
        style="perspective: 600px; transform-style: preserve-3d; height: 1.18em; vertical-align: -0.15em;"
      >
        <!-- Top copy: rolls up and away in 3D -->
        <span
          class="rolling-char rolling-char-top block"
          :style="{
            animationDuration: `${duration}s`,
            animationDelay: `${getCharDelay(wordIdx, charIdx)}s`,
          }"
        >
          {{ char }}
        </span>

        <!-- Bottom copy: rolls in from below in 3D -->
        <span
          class="rolling-char rolling-char-bottom absolute inset-0 block"
          :style="{
            animationDuration: `${duration}s`,
            animationDelay: `${getCharDelay(wordIdx, charIdx)}s`,
          }"
        >
          {{ char }}
        </span>
      </span>

      <!-- Space between words -->
      <span
        v-if="wordIdx < words.length - 1"
        class="rolling-space inline-block"
        style="width: 0.28em;"
      >&nbsp;</span>
    </span>
  </span>
</template>

<style scoped>
@keyframes roll-up-out {
  0% {
    transform: translateY(0%) rotateX(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%) rotateX(85deg);
    opacity: 0;
  }
}

@keyframes roll-up-in {
  0% {
    transform: translateY(100%) rotateX(-85deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0%) rotateX(0deg);
    opacity: 1;
  }
}

.rolling-char {
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

.rolling-char-top {
  animation-name: roll-up-out;
}

.rolling-char-bottom {
  animation-name: roll-up-in;
}
</style>

