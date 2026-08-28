<script setup lang="ts">
const toast = useToast()
const loading = ref(false)
const props = defineProps(['coupon', 'addressId', 'cart', 'tapinOrderType'])

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
        coupon: props.coupon?.code,
        address_id: props.addressId,
        tapin_order_type: props.tapinOrderType,
      }
    })
    toast.add({ title: 'در حال انتقال به صفحه پرداخت...', color: 'green' })
    await navigateTo(data.url, { external: true })
  } catch (error: any) {
    const msgs = Object.values(error?.data?.data?.message ?? { e: ['خطا در پرداخت'] }).flat()
    toast.add({ title: String(msgs[0] ?? 'خطا در پرداخت'), color: 'red' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UButton v-if="!loading" block @click="payment" class="h-full min-h-12 rounded-2xl font-black bg-mainColor text-secColor hover:bg-mainColor/90 shadow-[0_10px_28px_rgba(255,190,51,.18)]">
    💳 پرداخت
  </UButton>
  <UButton v-else loading block class="h-full min-h-12 rounded-2xl font-black bg-mainColor text-secColor">
    در حال انتقال...
  </UButton>
</template>
