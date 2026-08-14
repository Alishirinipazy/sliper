export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { public: { apiBase } } = useRuntimeConfig()

    try {
        const data = await $fetch(`${apiBase}/contact-us`, {
            method: 'POST',
            body,
            headers: { 'Accept': 'application/json' },
        })
        return data
    } catch (error) {
        throw createError({
            statusCode: error?.statusCode || error?.response?.status || 500,
            statusMessage: error?.statusMessage || 'خطا در ارسال پیام',
            data: error?.data,
        })
    }
})