export default defineEventHandler(async (event) => {
    const { public: { apiBase } } = useRuntimeConfig();
    const token = getCookie(event, 'token');

    if (!token) return null;

    try {
        const data = await $fetch(`${apiBase}/cart`, {
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
