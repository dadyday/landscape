<script setup lang="ts">
import type {ObjectData} from "gojs";

const props = defineProps({
  types: null,
  targets: null,
})
const link = defineModel<ObjectData>({ default: () => ({})})

function swapLinkTargets() {
  let tmp = link.value.from
  link.value.from = link.value.to
  link.value.to = tmp

  tmp = link.value.fromText
  link.value.fromText = link.value.toText
  link.value.toText = tmp
}

</script>

<template>
  <div class="col">
    <FieldInput v-model="link.label" label="Name" />
    <FieldSelect v-model="link.type" :options="types" label="Type" />
    <FieldRow>
      <FieldCol label="Von">
        <FieldSelect v-model="link.from" :options="targets" />
        <FieldInput v-model="link.fromLabel" />
      </FieldCol>
      <UButton icon="mdi:swap-horizontal" @click="swapLinkTargets" variant="ghost" size="xs" />
      <FieldCol label="Zu">
        <FieldSelect v-model="link.to" :options="targets" />
        <FieldInput v-model="link.toLabel" />
      </FieldCol>
    </FieldRow>
    <UTextarea v-model="link.text" label="Beschreibung" divs="5" />
  </div>
</template>

<style scoped>
@import "tailwindcss";
.col {
  @apply flex flex-col gap-1;
}

</style>
