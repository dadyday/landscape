<script setup lang="ts">
const props = defineProps({
  types: null,
  targets: null,
  tags: null,
})
const node = defineModel<ObjectData>({ default: () => ({ type: 'server' })})

</script>

<template>
  <div class="col">
    <FieldInput v-model="node.title" label="Name" />
    <FieldSelect v-model="node.type" :options="types" label="Type" />
    <FieldSelect v-model="node.group" :options="targets" label="Gehört zu" />
    <UTextarea v-model="node.text" label="Beschreibung" divs="5" />
    <FieldSelectMulti v-model="node.tags" :options="tags" label="Tags" x-change="refreshFilters"/>
  </div>
</template>

<style scoped>
@import "tailwindcss";
.col {
  @apply flex flex-col gap-1;
}

</style>
