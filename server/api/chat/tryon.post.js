// پروب مجازی: عکس کاربر + محصول انتخابی را به بک‌اند می‌فرستد.
// عکس کاربر هیچ‌جا ذخیره نمی‌شود؛ نتیجه مستقیم به مرورگر برمی‌گردد.
export default defineEventHandler(async (event) => {
    const parts = await readMultipartFormData(event)
    if (!parts?.length) {
        throw createError({ statusCode: 400, message: 'عکسی ارسال نشد' })
    }

    const { public: { apiBase } } = useRuntimeConfig()

    const form = new FormData()
    for (const part of parts) {
        if (!part.name) continue
        if (part.filename) {
            form.append(part.name, new Blob([part.data], { type: part.type || 'application/octet-stream' }), part.filename)
        } else {
            form.append(part.name, part.data.toString('utf-8'))
        }
    }

    // برای محدودیت تعداد درخواست در بک‌اند، IP واقعی کاربر را پاس می‌دهیم
    const ip = getRequestIP(event, { xForwardedFor: true })

    try {
        const data = await $fetch(`${apiBase}/chat/try-on`, {
            method: 'POST',
            body: form,
            headers: {
                Accept: 'application/json',
                ...(ip ? { 'X-Forwarded-For': ip } : {}),
            },
            timeout: 150000,
        })
        return data.data // { image: "data:image/png;base64,..." }
    } catch (error) {
        throw createError({
            statusCode: error.response?.status || 500,
            message: error.data?.message || 'ساخت عکس انجام نشد، دوباره امتحان کن',
        })
    }
})
