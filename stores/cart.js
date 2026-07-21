export const useModalStore = defineStore('open', () => {
    const isOpenModal = ref(false)
    const card = ref([]);
    const syncing = ref(false)

    const allItem = computed(() => card?.value)

    const totalAmount = computed(() => card?.value?.reduce((total, product) => {
        return total + (product.selectedPrice * product.qty)
    }, 0))

    function changeStatusModal() {
        isOpenModal.value = !isOpenModal.value
    }

    // shapes a server /cart item (see app/api/v1/cart.py on the backend)
    // into the same object shape the UI has always used locally, so
    // Cart.vue and the product page don't need to change at all.
    function _mapServerItem(item) {
        return {
            id: item.product_id,
            name: item.product_name,
            primary_image: item.product_image,
            serverId: item.id,
            _key: `${item.product_id}_${item.product_color_id}_${item.product_size_id}`,
            qty: item.quantity,
            selectedColor: item.product_color_id ? {
                id: item.product_color_id,
                name: item.color_name,
                color_code: item.color_code,
                image: item.color_image,
            } : null,
            selectedSize: item.product_size_id ? {
                id: item.product_size_id,
                size: item.size,
            } : null,
            selectedPrice: item.unit_price,
            inStock: item.in_stock,
        }
    }

    function _replaceFromServer(serverCart) {
        card.value = (serverCart?.items ?? []).map(_mapServerItem)
    }

    // Loads whatever's actually in the user's server-side cart - call after
    // login or on app init so a returning logged-in user sees their real cart.
    async function fetchFromServer() {
        try {
            const serverCart = await $fetch('/api/cart')
            if (serverCart) _replaceFromServer(serverCart)
        } catch {
            // not logged in, or a network hiccup - leave local state alone
        }
    }

    // Pushes any locally-added items (added while browsing as a guest) up
    // to the server cart, then reloads from there so prices/stock/ids are
    // all accurate. Safe to call repeatedly - only items without a
    // serverId yet get pushed.
    async function migrateGuestCartToServer() {
        const guestItems = card.value.filter(i => !i.serverId)
        syncing.value = true
        try {
            for (const item of guestItems) {
                try {
                    await $fetch('/api/cart/add', {
                        method: 'POST',
                        body: {
                            product_id: item.id,
                            product_color_id: item.selectedColor?.id ?? null,
                            product_size_id: item.selectedSize?.id ?? null,
                            quantity: item.qty,
                        }
                    })
                } catch {
                    // skip items the server rejects (out of stock, deleted, etc) -
                    // the rest still get migrated
                }
            }
            await fetchFromServer()
        } finally {
            syncing.value = false
        }
    }

    // اضافه کردن محصول با رنگ و سایز
    async function addToCart(product, count, color, size) {
        const { authUser } = useAuth()

        if (authUser.value) {
            try {
                const serverCart = await $fetch('/api/cart/add', {
                    method: 'POST',
                    body: {
                        product_id: product.id,
                        product_color_id: color?.id ?? null,
                        product_size_id: size?.id ?? null,
                        quantity: count,
                    }
                })
                _replaceFromServer(serverCart)
                return true
            } catch (error) {
                return false
            }
        }

        // guest - stays local until they log in (migrateGuestCartToServer
        // pushes it up at that point)
        const key = `${product.id}_${color?.id}_${size?.id}`
        const existing = card?.value?.find(p => p._key === key)
        if (existing) {
            existing.qty += count
        } else {
            card?.value?.push({
                ...product,
                _key: key,
                qty: count,
                selectedColor: color,
                selectedSize: size,
                selectedPrice: size?.price ?? product.price ?? 0,
            })
        }
        return true
    }

    function clear() {
        card.value = []
        // best-effort - if logged in, also clears the server cart; if not,
        // the local clear above is all there is anyway
        $fetch('/api/cart/clear', { method: 'DELETE' }).catch(() => {})
    }

    async function increment(key) {
        const item = card?.value?.find(p => p._key === key)
        if (!item) return

        if (item.serverId) {
            try {
                const serverCart = await $fetch('/api/cart/update', {
                    method: 'PATCH',
                    body: { item_id: item.serverId, quantity: item.qty + 1 }
                })
                _replaceFromServer(serverCart)
                return
            } catch {
                return
            }
        }
        item.qty++
    }

    async function dicrement(key) {
        const item = card?.value?.find(p => p._key === key)
        if (!item || item.qty <= 1) return

        if (item.serverId) {
            try {
                const serverCart = await $fetch('/api/cart/update', {
                    method: 'PATCH',
                    body: { item_id: item.serverId, quantity: item.qty - 1 }
                })
                _replaceFromServer(serverCart)
                return
            } catch {
                return
            }
        }
        item.qty--
    }

    async function remove(key) {
        const item = card?.value?.find(p => p._key === key)
        if (!item) return

        if (item.serverId) {
            try {
                const serverCart = await $fetch(`/api/cart/remove?item_id=${item.serverId}`, { method: 'DELETE' })
                _replaceFromServer(serverCart)
                return
            } catch {
                return
            }
        }
        card.value = card?.value?.filter(p => p._key !== key)
    }

    return {
        isOpenModal, changeStatusModal,
        allItem, totalAmount, card, syncing,
        addToCart, clear, increment, remove, dicrement,
        fetchFromServer, migrateGuestCartToServer,
    }
}, {
    persist: { key: "shopping-Cart" }
})
