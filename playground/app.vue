<template>
  <div>
    Nuxt module playground!

    <Landscape v-model="data" />
  </div>
</template>

<script setup>

const data = ref([
  [ // a JavaScript Array of JavaScript objects, one per node;
    { key: 1, type: "modul", title: "Module" },
    { key: 2, type: "api", title: "Api" },
    { key: 3, type: "app", title: "UI" },
    { key: 4, type: "cron", title: "process" },
    { key: 7, type: "daemon", title: "consumer" },
    { key: 8, type: "script", title: "cleanup" },
    { key: 5, type: "db", title: "Database" },
    { key: 6, type: "file", title: "Filestore" },
  ],
  [ // a JavaScript Array of JavaScript objects, one per link
    { type: 'request', from: 1, to: 2 },
    { type: 'dependency', from: 4, to: 1 },
    { type: '', from: 2, to: 2 },
    { type: 'request', from: 3, to: 1 },
    { type: 'request', from: 3, to: 2 },
  ],
])

</script>
