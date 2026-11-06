<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '~/lib/utils'

interface ButtonProps {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'teal'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  asChild?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'default',
  size: 'default',
  type: 'button',
  disabled: false,
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline':
      return 'border border-[#415A77]/60 bg-transparent hover:bg-[#415A77]/25 text-[#E0E1DD] hover:border-[#778DA9]'
    case 'secondary':
      return 'bg-[#1B263B] hover:bg-[#415A77]/40 text-[#CED4DA] border border-[#415A77]/30'
    case 'ghost':
      return 'hover:bg-white/10 text-[#E0E1DD]'
    case 'link':
      return 'text-teal-400 underline-offset-4 hover:underline p-0 h-auto'
    case 'teal':
      return 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(45,212,191,0.3)]'
    default:
      return 'bg-[#415A77] hover:bg-[#778DA9] text-white shadow-md'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-3.5 text-xs rounded-xl'
    case 'lg':
      return 'h-12 px-6 text-base rounded-2xl'
    case 'icon':
      return 'h-10 w-10 p-0 rounded-xl'
    default:
      return 'h-10 px-5 text-sm rounded-xl'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="
      cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-95 select-none',
        variantClasses,
        sizeClasses,
        props.class
      )
    "
  >
    <slot />
  </button>
</template>

