export default defineEventHandler(async (event) => {
    const { public: { apiBase } } = useRuntimeConfig();
    const token = getCookie(event, 'token');

    if (!token) throw createError({ statusCode: 401, message: 'ابتدا وارد حساب کاربری خود شوید' })

    try {
        const data = await $fetch(`${apiBase}/cart`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return data.data;
    } catch (error) {
        throw createError({ statusCode: error.response?.status || 500, data: error.data })
    }
})
