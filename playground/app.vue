<template>
  <div>
    Nuxt module playground!

    <Landscape v-model="data" />
  </div>
</template>

<script setup>
const data = ref([
  [ // a JavaScript Array of JavaScript objects, one per node;
    // the "color" property is added specifically for this app
    { key: 1, title: "Alpha", color: "lightblue" },
    { key: 2, title: "Beta", color: "orange" },
    { key: 3, title: "Gamma", color: "lightgreen" },
    { key: 4, title: "Delta", color: "pink" }
  ],
  [ // a JavaScript Array of JavaScript objects, one per link
    { from: 1, to: 2, type: 'data'},
    { from: 1, to: 3, type: 'control'},
    { from: 2, to: 2, type: ''},
    { from: 3, to: 4, type: null},
    { from: 4, to: 1 }
  ],
])

</script>
