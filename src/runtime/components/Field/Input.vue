<script setup lang="ts">
const inputValue = defineModel()
</script>

<template>
  <UFormField class="w-full">
    <UInput v-model="inputValue" />
  </UFormField>
</template>

<style scoped>

</style>
