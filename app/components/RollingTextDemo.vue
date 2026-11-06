<script setup lang="ts">
import { RollingText } from '@animate-ui/vue/primitives/texts/rolling'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'

withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })

const run = ref(0)
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <RollingText
      :key="`${run}-${delay}`"
      :delay="Number(delay)"
      class="text-4xl font-semibold"
      text="Rolling Text"
    />
    <Button variant="outline" size="sm" @click="run++">
      Replay
    </Button>
  </div>
</template>

