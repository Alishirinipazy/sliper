<script setup lang="ts">
const items = [
  'https://picsum.photos/600/600?random=1',
  'https://picsum.photos/600/600?random=2',
  'https://picsum.photos/600/600?random=3',
  'https://picsum.photos/600/600?random=4',
  'https://picsum.photos/600/600?random=5',
  'https://picsum.photos/600/600?random=6'
]
</script>
<template>
  <div>
    <div class="head-product-card">
      <h4 class="font-bold lg:text-2xl">
        دمپایی های داغ تابستونی
      </h4>
      <nuxt-link to="/product">
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
    <UCarousel class="py-3" v-slot="{ item }" :items="items" :ui="{ item: 'basis-full basis-1/2 md:basis-1/2 lg:basis-1/4' }" arrows>
     <ProductIitem :product-image="item"/>
    </UCarousel>
  </div>
</template>
<style>
.head-product-card {
  @apply flex w-full justify-between items-center my-5
}
</style>