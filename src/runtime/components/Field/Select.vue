<script setup lang="ts">


import {normalizeOptions, type Options} from "./options";

const props = withDefaults(defineProps<{
  options: Options,
  icon?: string,
  width?: string,
}>(),{
  width: '100%',
})

const items = computed(() => normalizeOptions(props.options))
const selectedId = defineModel()
const selectedItem = computed(() => items.value[selectedId.value])

</script>

<template>
  <UFormField>
    <USelectMenu
      v-model="selectedId"
      :items="Object.values(items)"
      valueKey="id"
      labelKey="label"
      :icon
      class="w-full"
    >
      <template #leading v-if="selectedItem?.icon">
        <div class="flex items-center justify-center">
          <UIcon v-if="selectedItem?.icon?.name" :name="selectedItem?.icon?.name" :color="selectedItem?.icon?.color" />
          <span v-else>{{ selectedItem?.icon?.text }}</span>
        </div>
      </template>
      <template #item-leading="{ item }">
        <div class="flex items-center justify-center">
          <UIcon v-if="item?.icon?.name" :name="item?.icon?.name" :color="item?.icon?.color" />
          <span v-else>{{ item?.icon?.text }}</span>
        </div>
      </template>
    </USelectMenu>
  </UFormField>
</template>

<style scoped>

</style>
