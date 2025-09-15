<script setup>

const data = ref([
  [ // a JavaScript Array of JavaScript objects, one per node;
    { key: -1, type: "server", title: "Server", isGroup: true },
    { key: -2, type: "server", title: "Internal", isGroup: true },
    { key: -3, type: "server", title: "Store", isGroup: true },
    { key: 1, type: "modul", title: "Module", group: -1 },
    { key: 2, type: "api", title: "Api", group: -1, tags: ["foo", "bar"] },
    { key: 3, type: "app", title: "UI", group: -1, tags: ["foo", "baz"] },
    { key: 4, type: "cron", title: "process", group: -1, tags: ["bar"] },
    { key: 7, type: "daemon", title: "consumer", group: -2, tags: ["baz"] },
    { key: 8, type: "script", title: "cleanup", group: -2 },
    { key: 5, type: "db", title: "Database", group: -3, hidden: true },
    { key: 6, type: "file", title: "Filestore", group: -3 },
  ],
  [ // a JavaScript Array of JavaScript objects, one per link
    { type: 'request', from: 1, to: 2 },
    { type: 'dependency', from: 4, to: 1 },
    { type: '', from: 2, to: 2 },
    { type: 'request', from: 3, to: 1 },
    { type: 'request', from: 3, to: 2 },
    { type: 'control', from: 8, to: 6 },
    { type: 'notify', from: 1, to: 7 },
  ],
])

</script>

<template>
  <div>
    Nuxt module playground!

    <UCard>
    <Landscape v-model="data" />
    </UCard>
  </div>
</template>
