export const useModalStore = defineStore('open', () => {
    const isOpenModal = ref(false)
    const card = ref([]);

    const allItem = computed(() => card?.value)

    const totalAmount = computed(() => card?.value?.reduce((total, product) => {
        return total + (product.selectedPrice * product.qty)
    }, 0))

    function changeStatusModal() {
        isOpenModal.value = !isOpenModal.value
    }

    // اضافه کردن محصول با رنگ و سایز
    function addToCart(product, count, color, size) {
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
    }

    function clear() { card.value = [] }

    function increment(key) {
        const item = card?.value?.find(p => p._key === key)
        if (item) item.qty++
    }

    function dicrement(key) {
        const item = card?.value?.find(p => p._key === key)
        if (item && item.qty > 1) item.qty--
    }

    function remove(key) {
        card.value = card?.value?.filter(p => p._key !== key)
    }

    return {
        isOpenModal, changeStatusModal,
        allItem, totalAmount, card,
        addToCart, clear, increment, remove, dicrement
    }
}, {
    persist: { key: "shopping-Cart" }
})
