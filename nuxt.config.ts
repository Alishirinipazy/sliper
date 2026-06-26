export default defineNuxtConfig({
    devtools: {enabled: true},
    runtimeConfig: {
        public: {
            apiBase: "http://localhost:8000/api"
        }
    },
    colorMode: {
        preference: 'light'
    },
    modules: [
        "@nuxt/ui",
        '@formkit/nuxt',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'nuxt-swiper'
    ],
    nitro: {
        preset: 'node-server'  // این رو اضافه کن
    },
    compatibilityDate: "2025-02-12",
    formkit: {
        autoImport: true
    },
    app: {
        head: {
            link: [
                {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
            ]
        }
    }
})