export default defineNuxtConfig({
    devtools: { enabled: false },

    runtimeConfig: {
        gapgptApiKey: process.env.GAPGPT_API_KEY || '',
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
        }
    },

    colorMode: { preference: 'light' },

    modules: [
        '@nuxt/ui',
        '@formkit/nuxt',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'nuxt-swiper',
    ],

    ssr: true,

    nitro: {
        preset: 'node-server'
    },

    compatibilityDate: '2025-02-12',

    formkit: { autoImport: true },

    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
        }
    }
})
