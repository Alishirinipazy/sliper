export default defineEventHandler(async (event) => {
    const body = await readBody(event) // { track_id, success, status }
    const { public: { apiBase } } = useRuntimeConfig()

    try {
        const data = await $fetch(`${apiBase}/payment/verify`, {
            method: 'POST',
            body,
            headers: { 'Accept': 'application/json' }
        })
        return data.data
    } catch (error) {
        throw createError({ statusCode: error.response?.status || 500, data: error.data })
    }
})
