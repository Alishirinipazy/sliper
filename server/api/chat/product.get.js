// جزئیات کامل یک محصول (رنگ‌ها و سایزها) برای انتخاب داخل چت
export default defineEventHandler(async (event) => {
    const { slug } = getQuery(event)
    const { public: { apiBase } } = useRuntimeConfig()

    if (!slug || typeof slug !== 'string') {
        throw createError({ statusCode: 400, message: 'slug محصول لازم است' })
    }

    try {
        const data = await $fetch(`${apiBase}/products/${encodeURIComponent(slug)}`, {
            headers: { Accept: 'application/json' },
        })
        return data.data
    } catch (error) {
        throw createError({ statusCode: error.response?.status || 500, message: 'محصول پیدا نشد' })
    }
})
