import type { Ref, ComputedRef } from 'vue'

export type CursorFollowSide = 'top' | 'bottom' | 'left' | 'right'
export type CursorFollowAlign = 'start' | 'center' | 'end'

export interface CursorContext {
  x: Ref<number>
  y: Ref<number>
  isInside: Ref<boolean>
  isDown: Ref<boolean>
  isGlobal: ComputedRef<boolean>
  containerRef: Ref<HTMLElement | null>
}

