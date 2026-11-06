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


