<script setup lang="ts">
import {numberFormat} from '~/utils/helper'

const props = defineProps<{ product: any }>()

const image = computed(() => props.product?.primary_image || props.product?.image || '/images/preloader.png')
const price = computed(() => props.product?.final_price ?? props.product?.price ?? props.product?.min_price ?? 0)
const onSale = computed(() => !!props.product?.on_sale && (props.product?.discount_percent ?? 0) > 0)
</script>

<template>
  <NuxtLink :to="`/products/${product?.slug}`" class="tile group">
    <div class="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
      <img :src="image" :alt="product?.name || 'محصول اسلیپر پاز'" loading="lazy"
           class="h-full w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-110">
      <span v-if="onSale" class="tile-badge">{{ product.discount_percent }}٪ تخفیف</span>
      <span v-if="product?.total_quantity === 0 || product?.in_stock === false" class="tile-soldout">ناموجود</span>
    </div>
    <h3 class="mt-2 truncate px-1 text-sm font-bold text-secColor">{{ product?.name }}</h3>
    <div class="flex items-baseline gap-2 px-1 pb-1">
      <span class="text-sm font-black" :class="onSale ? 'text-cosColor' : 'text-secColor'">{{ numberFormat(price) }} <small class="font-normal">تومان</small></span>
      <span v-if="onSale" class="text-xs text-secColor/45 line-through">{{ numberFormat(product?.regular_price) }}</span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.tile {
  @apply block rounded-3xl bg-white p-2 shadow-md shadow-gray-300/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl;
}

.tile-badge {
  @apply absolute right-2 top-2 rounded-full bg-cosColor px-2 py-0.5 text-[11px] font-bold text-white shadow;
}

.tile-soldout {
  @apply absolute inset-x-0 bottom-0 bg-secColor/75 py-1 text-center text-xs text-white;
}
</style>
