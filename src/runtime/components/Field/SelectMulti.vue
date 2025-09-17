<script setup lang="ts">


import {normalizeOptions, type Options} from "./options";

const props = defineProps<{
  options: string[],
}>()

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
      class="w-full"
    >
    </UInputMenu>
  </UFormField>
</template>

<style scoped>

</style>
