<script setup lang="ts">
const props = defineProps(['product'])
</script>
<template>

  <UCard class="m-2 shadow shadow-gray-700 direction-set-rtl relative" >
    <img class="w-full rounded-t-2xl" :src="product?.primary_image" alt="">
    <template #footer>

      <h4 class="text-center font-bold">{{product?.name}}</h4>


        <div class="flex justify-between w-full items-center mt-2">
        <p :class="product?.is_sale?'line-through':''">  210,000 تومان</p>
        <UButton class="rounded-full mx-1" icon="icon-park-outline:buy"   color="yellow"/>
      </div>
      <p v-if="product?.is_sale" class="text-center">  210,000 تومان</p>
    </template>
    <div class="product-option" v-if="product?.sale_price">
      {{(product?.price /product?.sale_price)*100}} % تخفیف
    </div>
  </UCard>

</template>
<style>
.color-product {
  @apply w-3 h-3 mx-1 rounded-full relative
}
.product-option {
  @apply absolute w-auto  p-1 rounded text-xs top-2 left-2 bg-cosColor text-center

}
</style>