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
  <div>
    <div class="head-product-card">

      <h4 class="font-bold lg:text-2xl">
       {{props.dataProduct.title}}
      </h4>
      <nuxt-link :to="props.dataProduct.link">
        <UButton
            icon="material-symbols:arrow-circle-left-outline-rounded"
            size="sm"
            color="yellow"
            variant="outline"
            label="مشاهده همه"
            trailing
        />
      </nuxt-link>
    </div>
    <UCarousel class="py-1" ref="carouselRef"
               v-slot="{ item }" :items="props.dataProduct.product"
               :ui="{ item: 'basis-full basis-1/2 md:basis-1/2 lg:basis-1/4' }" arrows>
      <ProductIitem :product="item"/>
    </UCarousel>

  </div>
</template>
<style>
.head-product-card {
  @apply flex w-full justify-between items-center my-5 px-2
}

</style>