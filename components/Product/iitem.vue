<script setup lang="ts">
const props = defineProps(['product'])
</script>
<template>

  <UCard class="m-2 shadow shadow-gray-700 direction-set-rtl relative" >
    <img class="w-full rounded-t-2xl" :src="props.product" alt="">
    <template #footer>

      <h4 class="text-center font-bold">دمپاییی پاپا پی یو </h4>

      <div class="flex justify-between w-full items-center mt-2">
        <ul class="flex" >
          <li class="color-product bg-pink-300"></li>
          <li class="color-product bg-gray-300"></li>
          <li class="color-product bg-blue-500"></li>
          <li class="color-product bg-amber-200"></li>
        </ul>
        <p><i class="bg-gray-500 border rounded text-[12px] px-1">30:40</i></p>
      </div>
      <div class="flex justify-between w-full items-center mt-2">
        <p >  210,000 تومان</p>
        <UButton class="rounded-full mx-1" icon="icon-park-outline:buy"   color="yellow"/>
      </div>
    </template>
    <div class="product-option">
      15% تخفیف
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