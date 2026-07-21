export default defineEventHandler(async (event) => {
    const body = await readBody(event) // { item_id, quantity }
    const { public: { apiBase } } = useRuntimeConfig();
    const token = getCookie(event, 'token');

    if (!token) throw createError({ statusCode: 401, message: 'ابتدا وارد حساب کاربری خود شوید' })

    try {
        const data = await $fetch(`${apiBase}/cart/items/${body.item_id}`, {
            method: 'PATCH',
            body: { quantity: body.quantity },
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
