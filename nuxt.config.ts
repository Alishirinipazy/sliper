// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui",'@nuxthub/core'],
  compatibilityDate: "2025-02-12",
  app:{
    link: [{ rel: 'icon', type: '/fav.png', href: '/k' }],
  }
})