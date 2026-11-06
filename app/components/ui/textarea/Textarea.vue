<script setup lang="ts">
import { cn } from '~/lib/utils'

withDefaults(
  defineProps<{
    modelValue?: string
    defaultValue?: string
    id?: string
    name?: string
    placeholder?: string
    rows?: number | string
    required?: boolean
    disabled?: boolean
    class?: string
  }>(),
  {
    rows: 4,
  }
)

defineEmits<{
  (e: 'update:modelValue', val: string): void
}>()
</script>

<template>
  <textarea
    :id="id"
    :name="name"
    :rows="rows"
    :value="modelValue !== undefined ? modelValue : defaultValue"
    :placeholder="placeholder"
    :required="required"
    :disabled="disabled"
    :class="
      cn(
        'flex w-full rounded-2xl border border-[#415A77]/50 bg-[#0D1B2A]/90 px-4 py-3 text-sm text-[#E0E1DD] placeholder:text-[#778DA9]/60 shadow-inner transition-all duration-200 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50 disabled:cursor-not-allowed disabled:opacity-50 min-h-[110px] resize-y leading-relaxed',
        $props.class
      )
    "
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

