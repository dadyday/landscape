<script setup lang="ts">


import {normalizeOptions, type Options} from "./options";

const props = defineProps<{
  options: Options,
}>()

const items = computed(() => normalizeOptions(props.options))
const selectedId = defineModel()
const selectedItem = computed(() => items.value[selectedId.value])


</script>

<template>
  <UFormField>
    <USelect
      v-model="selectedId"
      :items="Object.values(items)"
      valueKey="id"
      labelKey="label"
      class="w-full"
    >
      <template #leading="{}">
        <div class="flex items-center justify-center">
          <UIcon v-if="selectedItem?.icon.name" :name="selectedItem?.icon.name" :color="selectedItem?.icon.color" />
          <span v-else>{{ selectedItem?.icon.text }}</span>
        </div>
      </template>
      <template #item-leading="{ item }">
        <div class="flex items-center justify-center">
          <UIcon v-if="item?.icon.name" :name="item?.icon.name" :color="item?.icon.color" />
          <span v-else>{{ item?.icon.text }}</span>
        </div>
      </template>
    </USelect>
  </UFormField>
</template>

<style scoped>

</style>
