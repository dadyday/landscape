<script setup lang="ts">
import { useDraggable } from '@vueuse/core'

const props = defineProps<{
  label: String
}>()

const boxEl = useTemplateRef<HTMLElement>('boxEl')
const { x, y, style } = useDraggable(boxEl, {
  initialValue: { x: 100, y: 50 },
})
</script>

<template>
  <UCard
    class="fixed"
    :style
    style="z-index: 1000"
  >
    <template #header>
      <h2 class="text-highlighted font-semibold" ref="boxEl">
        {{ label }}
      </h2>
    </template>

    <slot />
  </UCard>
</template>

<style scoped>

</style>
