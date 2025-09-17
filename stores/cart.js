export const useModalStore = defineStore('open', () => {
    // the methods (state)
    const isOpenModal = ref(false)
    const card = ref([]);
    // the computed methods (getters)
    const allItem = computed(() => card?.value)
    const totalAmount = computed(() => card?.value?.reduce((total, product) => {
        return product.is_sale ? total + (product.sale_price * product.qty) : total + (product.price * product.qty)
    }, 0))

    // the function (action)
    function changeStatusModal() {
        isOpenModal.value = !isOpenModal.value
        console.log(isOpenModal.value)
    }

    function addToCart(product, count) {
        card?.value?.push({
            ...product,
            qty: count,
        });

    }

    function clear() {
        card.value = [];
    }

    function increment(id) {
        const item = card?.value?.find((p) => p.id == id);
        if (item) {
            item.qty++;
        }
    }

    function dicrement(id) {
        const item = card?.value?.find((p) => p.id == id);
        if (item) {
            item.qty--;
        }
    }

    function remove(id) {
        this.card = card?.value?.filter((p) => p.id != id);
    }

    return {isOpenModal, changeStatusModal, allItem, totalAmount, card, addToCart, clear, increment, remove, dicrement}
}, {
    persist: {
        key: "shopping-Cart",
    }
})