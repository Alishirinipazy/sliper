// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig:{
    public:{
    apiBase : "http://localhost:8000/api"
    }
  },
  modules: ["@nuxt/ui",'@nuxthub/core'],
  compatibilityDate: "2025-02-12",
  app:{
    link: [{ rel: 'icon', type: '/fav.png', href: '/' }],
  }
})