export default defineNuxtConfig({
    devtools: { enabled: false },

    runtimeConfig: {
        public: {
            apiBase: process.env.NUXT_PUBLIC_API_BASE
        }
    },

    colorMode: {
        preference: 'light'
    },

    modules: [
        '@nuxt/ui',
        '@formkit/nuxt',
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
        'nuxt-swiper',
    ],

    compatibilityDate: '2025-02-12',


    ssr: true,

    nitro: {
        preset: 'node-server'
    },

    formkit: {
        autoImport: true
    },

    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            ]
        }
    },

    vite: {
        optimizeDeps: {
            include: ['vue3-tabs-component']
        }
    }
})
