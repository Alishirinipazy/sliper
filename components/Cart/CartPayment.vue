<script setup lang="ts">
const toast    = useToast()
const loading  = ref(false)
const props    = defineProps(['coupon', 'addressId', 'cart', 'shippingMethodId'])

async function payment() {
    if (!props.addressId) {
        toast.add({ title: 'آدرس انتخاب نشده 📍', color: 'red' })
        return
    }
    if (!props.shippingMethodId) {
        toast.add({ title: 'روش ارسال انتخاب نشده 🚚', color: 'red' })
        return
    }

    try {
        loading.value = true
        const data = await $fetch('/api/payment/send', {
            method: 'POST',
            body: {
                cart: props.cart.map(item => ({
                    id:       item.id,
                    qty:      item.qty,
                    color_id: item.selectedColor?.id,
                    size_id:  item.selectedSize?.id,
                })),
                coupon:             props.coupon.code,
                address_id:         props.addressId,
                shipping_method_id: props.shippingMethodId,
            }
        })
        toast.add({ title: 'در حال انتقال به صفحه پرداخت...', color: 'green' })
        await navigateTo(data.url, { external: true })
    } catch (error) {
        const msgs = Object.values(error.data?.data?.message ?? { e: ['خطا در پرداخت'] }).flat()
        toast.add({ title: msgs[0], color: 'red' })
    } finally {
        loading.value = false
    }
}
</script>

<template>
  <UButton v-if="!loading" color="blue" block @click="payment" class="h-full font-bold">
    💳 پرداخت
  </UButton>
  <UButton v-else loading color="blue" block class="h-full">
    در حال انتقال...
  </UButton>
</template>
