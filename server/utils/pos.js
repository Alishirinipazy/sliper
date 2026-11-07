// پروکسی مشترک فروش حضوری: توکن ادمین فقط داخل کوکی httpOnly نگه‌داری می‌شه
// و مرورگر هیچ‌وقت مستقیم به بک‌اند نمی‌رسه.
export const POS_COOKIE = 'pos_token'

export async function posFetch(event, path, options = {}) {
    const { public: { apiBase } } = useRuntimeConfig()
    const token = getCookie(event, POS_COOKIE)
    if (!token) throw createError({ statusCode: 401, statusMessage: 'وارد نشده‌اید' })

    try {
        const res = await $fetch(`${apiBase}/admin-panel/pos${path}`, {
            ...options,
            headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
        })
        return res.data
    } catch (error) {
        const status = error?.response?.status || error?.statusCode || 500
        if (status === 401 || status === 403) deleteCookie(event, POS_COOKIE, { path: '/' })
        const msg = error?.data?.message
        throw createError({
            statusCode: status,
            statusMessage: typeof msg === 'string' ? msg : (status === 401 || status === 403 ? 'نشست تمام شده، دوباره وارد شو' : 'خطا در ارتباط با سرور'),
        })
    }
}
