const apiBase = process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000/api'
// backend origin without the /api/v1 suffix, e.g. http://localhost:8000 -
// used to proxy /storage/** (product/category/etc images) through to FastAPI,
// since the backend returns relative paths like "/storage/images/products/x.jpg"
// and this app runs on a different origin/port.
const apiOrigin = apiBase.replace(/\/api\/v1\/?$/, '')

export default defineNuxtConfig({
    devtools: { enabled: false },

    runtimeConfig: {
        public: {
            apiBase
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

    routeRules: {
        '/storage/**': { proxy: `${apiOrigin}/storage/**` }
    },

    compatibilityDate: '2025-02-12',

    formkit: { autoImport: true },

    app: {
        head: {
            link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.ico' }]
        }
    }
})
