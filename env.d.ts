/// <reference types="vite/client" />

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.webp' {
  const content: string
  export default content
}

declare module '@animate-ui/vue/primitives/effects/effect' {
  import type { DefineComponent } from 'vue'
  export const Effects: DefineComponent<Record<string, any>>
  export default Effects
}

declare module '@animate-ui/vue' {
  import type { DefineComponent } from 'vue'
  export const Effects: DefineComponent<Record<string, any>>
  export default Effects
}

declare module '@/components/ui/effects' {
  import type { DefineComponent } from 'vue'
  export const Effects: DefineComponent<Record<string, any>>
  export default Effects
}

declare module '~/components/ui/effects' {
  import type { DefineComponent } from 'vue'
  export const Effects: DefineComponent<Record<string, any>>
  export default Effects
}

declare module '@animate-ui/vue/primitives/cursor' {
  import type { DefineComponent } from 'vue'
  export type CursorFollowSide = 'top' | 'bottom' | 'left' | 'right'
  export type CursorFollowAlign = 'start' | 'center' | 'end'
  export const Cursor: DefineComponent<Record<string, any>>
  export const CursorContainer: DefineComponent<Record<string, any>>
  export const CursorFollow: DefineComponent<Record<string, any>>
  export const CursorProvider: DefineComponent<Record<string, any>>
}

declare module '@/components/ui/cursor' {
  import type { DefineComponent } from 'vue'
  export type CursorFollowSide = 'top' | 'bottom' | 'left' | 'right'
  export type CursorFollowAlign = 'start' | 'center' | 'end'
  export const Cursor: DefineComponent<Record<string, any>>
  export const CursorContainer: DefineComponent<Record<string, any>>
  export const CursorFollow: DefineComponent<Record<string, any>>
  export const CursorProvider: DefineComponent<Record<string, any>>
}

declare module '~/components/ui/cursor' {
  import type { DefineComponent } from 'vue'
  export type CursorFollowSide = 'top' | 'bottom' | 'left' | 'right'
  export type CursorFollowAlign = 'start' | 'center' | 'end'
  export const Cursor: DefineComponent<Record<string, any>>
  export const CursorContainer: DefineComponent<Record<string, any>>
  export const CursorFollow: DefineComponent<Record<string, any>>
  export const CursorProvider: DefineComponent<Record<string, any>>
}



