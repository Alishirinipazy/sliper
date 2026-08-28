export default defineEventHandler(async (event) => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = getCookie(event, 'token')

  try {
    const data = await $fetch(`${apiBase}/tapin/provinces`, {
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return data.data
  } catch (error) {
    throw createError({
      statusCode: error?.statusCode || error?.response?.status || 500,
      statusMessage: error?.data?.message || 'خطا در دریافت لیست استان‌ها',
      data: error?.data,
    })
  }
})
