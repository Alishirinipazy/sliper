<script setup lang="ts">
const {data:addresses} = await useFetch('/api/cart/addresses')
const selected = ref([])
const emit = defineEmits(['setAddressId'])
</script>

<template>

  <select @change="(el)=>emit('setAddressId',el.target.value)" class="bg-mainColor/30    p-1 rounded" aria-label="Default select example">
    <option value="">انتخاب آدرس</option>
    <option v-for="(address) in addresses" :key="address.id" :value="address.id">{{ address.title }}</option>
  </select>
  <NuxtLink to="/profile/addresses" >
    <u-button color="yellow" block class="my-1">
      آدرس جدید
    </u-button>
  </NuxtLink>
</template>

<style scoped>

</style>