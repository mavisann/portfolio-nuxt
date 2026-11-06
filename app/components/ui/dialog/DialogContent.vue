<script setup lang="ts">
import { inject, type Ref, onMounted, onUnmounted, computed } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    from?: 'top' | 'bottom' | 'left' | 'right'
    showCloseButton?: boolean
    class?: string
  }>(),
  {
    from: 'top',
    showCloseButton: true,
  }
)

const isOpen = inject<Ref<boolean>>('dialog-is-open')
const setOpen = inject<(val: boolean) => void>('dialog-set-open')

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen?.value) {
    setOpen?.(false)
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})

const fromClasses = computed(() => {
  switch (props.from) {
    case 'bottom':
      return 'translate-y-4'
    case 'left':
      return '-translate-x-4'
    case 'right':
      return 'translate-x-4'
    default:
      return '-translate-y-4'
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none"
      >
        <!-- Backdrop Overlay -->
        <div
          class="fixed inset-0 bg-[#070D14]/80 backdrop-blur-md transition-opacity"
          @click="setOpen?.(false)"
        />

        <!-- Dialog Card -->
        <Transition
          appear
          enter-active-class="transition duration-300 ease-out"
          :enter-from-class="'opacity-0 scale-95 ' + fromClasses"
          enter-to-class="opacity-100 scale-100 translate-x-0 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-x-0 translate-y-0"
          :leave-to-class="'opacity-0 scale-95 ' + fromClasses"
        >
          <div
            :class="
              cn(
                'relative z-10 w-full max-w-lg rounded-3xl bg-[#1B263B]/95 border border-[#415A77]/50 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-[#E0E1DD] select-auto',
                props.class
              )
            "
            role="dialog"
            aria-modal="true"
            @click.stop
          >
            <!-- Close Button -->
            <button
              v-if="showCloseButton"
              type="button"
              class="absolute top-5 right-5 p-2 rounded-full text-[#778DA9] hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              aria-label="Close dialog"
              @click="setOpen?.(false)"
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <!-- Dialog Body Slots -->
            <slot />
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

