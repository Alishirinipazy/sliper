// آیا پرو هوشمند الان برای این بازدیدکننده در دسترسه؟ ({ logged_in, remaining })
export default defineEventHandler(async (event) => {
    const { public: { apiBase } } = useRuntimeConfig()
    const token = getCookie(event, 'token')
    if (!token) return { logged_in: false, remaining: 0 }
    try {
        const data = await $fetch(`${apiBase}/chat/try-on/status`, {
            headers: { Accept: 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })
        return data.data
    } catch {
        // اگر بک‌اند جواب نداد، رابط کاربری با فرض «در دسترس» جلو می‌رود و خطای واقعی موقع ساخت نشان داده می‌شود
        return { logged_in: true, remaining: 1 }
    }
})
