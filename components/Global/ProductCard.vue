<script setup lang="ts">
const props = defineProps(['dataProduct']);
const carouselRef = ref()

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0)
    }

    carouselRef.value.next()
  }, 3000)
})
</script>
<template>
  <UCarousel
      class="p-4 bg-cosColor rounded-2xl"
      ref="carouselRef"
      dir="rtl"
      v-slot="{ item }"
      :items="[
  { isStatic: true },
  ...props?.dataProduct?.products || [],
]"
      :ui="{
    item: 'basis-1/2 lg:basis-1/4'
  }"
  >
    <div v-if="item.isStatic" class="w-64 h-full">
      <NuxtLink
          :to="props?.dataProduct?.link"
          class="h-full min-h-[300px] flex items-center justify-center rounded-xl border border-dashed"
      >
        <div class="text-center">
          <img src="/images/cupon.png" alt="">
        </div>
      </NuxtLink>
    </div>

    <div v-else class="w-64 ">
      <ProductIitem :product="item" />
    </div>
  </UCarousel>
</template>
<style>
.head-product-card {
  @apply flex w-full justify-between items-center my-5 px-2
}

</style>