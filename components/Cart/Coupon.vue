<script setup lang="ts">
const toast = useToast();
const coponCode = ref('');
const loading = ref(false);
const errorMSG = ref([]);
const props = defineProps(['coupon']);
async function checkCoupon() {

  if (coponCode.value === "" || coponCode.value === null) {
    toast.add({title:"ناززیی.. کد تخفیف را وارد کن."});
    return
  }
  try {
    loading.value = true
    const data = await $fetch('/api/cart/checkCoupon', {
      method: 'POST',
      body: { code: coponCode.value }
    })
    toast.add({title:'ناززززییی.... کدت کار کرد'})
    props.coupon.code = coponCode.value;
    props.coupon.percent = data.percentage;
  } catch (error) {
    errorMSG.value = Object.values(error.data.data.message).flat().toString();
    toast.add({title:`${errorMSG.value}`})

  }finally {
    loading.value = false
  }

}
</script>

<template>
  <div class="flex mb-1">
  <UInput color="pink" variant="outline" v-model="coponCode" placeholder="کد تخفیف داری" />

  <u-button v-if="!loading" @click="checkCoupon" class="mr-1 " color="pink" >
    اعمال کنم
  </u-button>
    <u-button loading v-else class="mr-1 " color="pink" >
    بررسی کنم
  </u-button>
  </div>
</template>

<style scoped>

</style>