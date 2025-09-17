<script setup lang="ts">
const toast = useToast();
const loading = ref(false)
const errorMSG = ref([]);
const props = defineProps(['coupon', 'addressId', 'cart']);
async function payment() {

  if (props.addressId === "" || props.addressId === null) {
    toast.add({title:"ناززیی.. آدرس انتخاب نشده"});
    return
  }
  try {
    loading.value = true;
    const data = await $fetch('/api/payment/send', {
      method: 'POST',
      body: {
        cart: props.cart,
        coupon: props.coupon.code,
        address_id: props.addressId
      }

    })
    toast.add({title:"در حال ارسال اطلاعات به صفحه پرداخت"})
    await navigateTo(data.url,{
      external:true
    })
  } catch (error) {
    errorMSG.value = Object.values(error.data.data.message).flat()
    toast.add({title:`${errorMSG.value}`})
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <UButton v-if="!loading" color="blue" block @click="payment" class="h-full">
     پرداخت ناقابله ؟!
  </UButton>
  <UButton loading v-else color="blue"  block>
    در حال پرداخت
  </UButton>
</template>

<style scoped>

</style>