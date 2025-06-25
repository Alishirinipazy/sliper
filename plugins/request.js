// import { defineNuxtPlugin, useCookie, useRequestURL, useRuntimeConfig } from 'nuxt/app'
// import { ACCESS_TOKEN_NAME } from '@/assets/js/auth/constants'
// import { createRequestInstance } from '@/assets/js/request'
//
// export default defineNuxtPlugin((nuxt) => {
//     const runtimeConfig = useRuntimeConfig()
//
//     const accessToken = useCookie(ACCESS_TOKEN_NAME)
//
//     const url = useRequestURL()
//
//     let origin = undefined
//     if (process.env.PRODUCT_STATUS === 'local' && process.server) {
//         origin = process.env.ORIGIN
//     } else if (process.server) origin = url.origin
//     else origin = undefined
//
//     const request = createRequestInstance(
//         runtimeConfig.public.API_URL,
//         {
//             headers: {
//                 origin,
//                 Accept: 'application/json'
//             }
//         },
//         accessToken?.value || null
//     )
//
//     return {
//         provide: {
//             request
//         }
//     }
// })
