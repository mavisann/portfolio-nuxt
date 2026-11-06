<script setup lang="ts">
import { cn } from '~/lib/utils'

defineProps<{
  modelValue?: string | number
  defaultValue?: string | number
  type?: string
  id?: string
  name?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  class?: string
}>()

defineEmits<{
  (e: 'update:modelValue', val: string | number): void
}>()
</script>

<template>
  <input
    :id="id"
    :name="name"
    :type="type || 'text'"
    :value="modelValue !== undefined ? modelValue : defaultValue"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :class="
      cn(
        'flex h-11 w-full rounded-2xl border border-[#415A77]/50 bg-[#0D1B2A]/90 px-4 py-2 text-sm text-[#E0E1DD] placeholder:text-[#778DA9]/60 shadow-inner transition-all duration-200 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 disabled:cursor-not-allowed disabled:opacity-50',
        $props.class
      )
    "
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

