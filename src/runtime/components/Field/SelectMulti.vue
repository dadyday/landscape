<script setup lang="ts">


import {normalizeOptions, type Options} from "./options";

const props = withDefaults(defineProps<{
  options: string[],
  icon?: string,
  width?: string,
}>(),{
  width: '100%',
})

//const items = computed(() => normalizeOptions(props.options))
const selectedItems = defineModel({ default: () => [] as string[]})
const searchTerm = ref()
const items = computed(() => {
  return searchTerm.value ? [searchTerm.value, ...props.options] : props.options
})


</script>

<template>
  <UFormField>
    <UInputMenu
      v-model="selectedItems"
      v-model:search-term="searchTerm"
      multiple
      :items
      :icon
      class="w-full" :style="{ width }"
    >
    </UInputMenu>
  </UFormField>
</template>

<style scoped>

</style>
