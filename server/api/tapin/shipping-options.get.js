export default defineEventHandler(async (event) => {
  const { public: { apiBase } } = useRuntimeConfig()
  const token = getCookie(event, 'token')
  const query = getQuery(event)

  try {
    const data = await $fetch(`${apiBase}/tapin/shipping-options`, {
      query: { address_id: query.address_id },
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return data.data
  } catch (error) {
    throw createError({
      statusCode: error?.statusCode || error?.response?.status || 500,
      statusMessage: error?.data?.message || 'خطا در دریافت روش‌های ارسال',
      data: error?.data,
    })
  }
})
