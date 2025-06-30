// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    runtimeConfig: {
        public: {
            apiBase: "http://localhost:8000/api"
        }
    },
    modules: ["@nuxt/ui", '@nuxthub/core','@formkit/nuxt'],
    compatibilityDate: "2025-02-12",
    formkit: {
        // Experimental support for auto loading (see note):
        autoImport: true
    },
    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ]
        },

    }
})