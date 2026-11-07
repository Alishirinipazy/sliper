// ورود فروشنده: همان ایمیل و رمز ادمین، ولی توکنش در کوکیِ جدا از ورود مشتری‌ها می‌ره
export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { public: { apiBase } } = useRuntimeConfig()

    try {
        const res = await $fetch(`${apiBase}/admin-panel/auth/login`, {
            method: 'POST',
            body: { email: body?.email, password: body?.password },
            headers: { Accept: 'application/json' },
        })
        setCookie(event, POS_COOKIE, res.data.token, {
            httpOnly: true,
            secure: !import.meta.dev,
            sameSite: 'strict',
            maxAge: 60 * 60 * 12,
            path: '/',
        })
        return { name: res.data.user?.name || '' }
    } catch (error) {
        const status = error?.response?.status || 500
        throw createError({
            statusCode: status === 422 ? 401 : status,
            statusMessage: status === 422 ? 'ایمیل یا رمز اشتباهه' : 'ورود انجام نشد، دوباره امتحان کن',
        })
    }
})
