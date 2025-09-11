export default defineNuxtConfig({
  modules: [
    '../src/module',
    "@nuxt/ui",
    "@nuxt/icon",
  ],
  devtools: { enabled: true },
  css: ['~/main.css']
})
