<script setup lang="ts">
const toast    = useToast()
const loading  = ref(false)
const props    = defineProps(['coupon', 'addressId', 'cart', 'tapinOrderType'])

async function payment() {
  if (!props.addressId) {
    toast.add({ title: 'آدرس انتخاب نشده 📍', color: 'red' })
    return
  }
  if (!props.tapinOrderType) {
    toast.add({ title: 'روش ارسال انتخاب نشده 🚚', color: 'red' })
    return
  }

  try {
    loading.value = true
    const data = await $fetch('/api/payment/send', {
      method: 'POST',
      body: {
        coupon:           props.coupon.code,
        address_id:       props.addressId,
        tapin_order_type: props.tapinOrderType,
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
  <UButton v-if="!loading" color="yellow" block size="lg" @click="payment" class="font-extrabold mt-3 rounded-2xl">
    💳 پرداخت و ثبت سفارش
  </UButton>
  <UButton v-else loading color="yellow" block size="lg" class="mt-3 rounded-2xl">
    در حال انتقال...
  </UButton>
</template>