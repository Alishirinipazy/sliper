// پیشنهادهای ویژه برای شروع گفتگو (تخفیف‌ها / پرفروش‌ها / جدیدترین‌ها)
export default defineEventHandler(async () => {
    const { public: { apiBase } } = useRuntimeConfig()

    try {
        const data = await $fetch(`${apiBase}/products/featured`, {
            query: { limit: 6 },
            headers: { Accept: 'application/json' },
        })
        return data.data
    } catch (error) {
        throw createError({ statusCode: error.response?.status || 500, message: 'خطا در دریافت پیشنهادها' })
    }
})
