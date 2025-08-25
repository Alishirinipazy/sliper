// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    runtimeConfig: {
        public: {
            apiBase: "https://api.sliper.ir/api"
        }
    },
    colorMode: {
        preference: 'light'
    },
    modules: ["@nuxt/ui", '@nuxthub/core', '@formkit/nuxt', 'nuxt-swiper','nuxt-swiper'],
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