export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { messages, productSlug } = body
    const { public: { apiBase } } = useRuntimeConfig()
    const token = getCookie(event, 'token')

    try {
        const data = await $fetch(`${apiBase}/chat`, {
            method: 'POST',
            body: {
                messages,
                product_slug: productSlug || null,
            },
            headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            }
        })

        return data.data // { reply, cart_updated, products }
    } catch (error) {
        console.error('AI assistant error:', error)
        throw createError({ statusCode: error.response?.status || 500, message: 'خطا در اتصال به دستیار هوشمند' })
    }
})
