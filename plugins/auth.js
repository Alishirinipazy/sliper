export default defineNuxtPlugin(async (nuxtApp) => {
    const { authUser } = useAuth();

    try {
        const user = await $fetch('/api/auth/me', {
            headers: useRequestHeaders(['cookie'])
        })

        authUser.value = user;

        if (user && process.client) {
            const { useModalStore } = await import('~/stores/cart');
            const cart = useModalStore();
            await cart.migrateGuestCartToServer();
        }
    } catch (error) {
        authUser.value = null;
    }
})