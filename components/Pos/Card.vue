<script setup lang="ts">
import {numberFormat} from '~/utils/helper'

// کارت محصول در صفحه‌ی فروش حضوری
const props = defineProps<{ product: any; index?: number }>()
defineEmits<{ (e: 'pick', product: any): void }>()

const soldOut = computed(() => props.product.stock <= 0)
const percent = computed(() => props.product.on_sale && props.product.regular_price
    ? Math.round((1 - props.product.final_price / props.product.regular_price) * 100) : 0)
</script>

<template>
  <button type="button" class="card group pop-in" :class="{'card-out': soldOut}" :style="{'--i': Math.min((index ?? 0) * 40, 400)}"
          :disabled="soldOut" @click="$emit('pick', product)">
    <span class="relative block aspect-square w-full overflow-hidden rounded-2xl bg-gray-50">
      <img :src="product.image || '/images/preloader.png'" :alt="product.name" loading="lazy"
           class="h-full w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105">
      <span v-if="percent" class="absolute right-2 top-2 rounded-full bg-cosColor px-2 py-0.5 text-[11px] font-bold text-white">{{ percent }}٪</span>
      <span v-if="soldOut" class="absolute inset-x-0 bottom-0 bg-secColor/80 py-1 text-center text-xs text-white">ناموجود</span>
      <span v-else-if="product.stock <= 3" class="absolute inset-x-0 bottom-0 bg-cosColor/90 py-0.5 text-center text-[11px] text-white">فقط {{ product.stock }} عدد مونده</span>
    </span>
    <span class="mt-2 block truncate text-start text-sm font-bold text-secColor">{{ product.name }}</span>
    <span class="flex items-baseline gap-2">
      <span class="text-sm font-black" :class="product.on_sale ? 'text-cosColor' : 'text-secColor'">{{ numberFormat(product.final_price) }} <small class="font-normal">تومان</small></span>
      <span v-if="product.on_sale" class="text-xs text-gray-400 line-through">{{ numberFormat(product.regular_price) }}</span>
    </span>
    <span v-if="product.colors?.length" class="mt-1.5 flex items-center gap-1">
      <span v-for="c in product.colors.slice(0, 6)" :key="c.id" class="h-3 w-3 rounded-full border border-black/10" :style="{background: c.color_code}"></span>
    </span>
  </button>
</template>

<style scoped>
.card {
  @apply block w-full rounded-3xl bg-white p-2 text-start shadow-md shadow-gray-300/70 transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[.97];
}

.card-out {
  @apply cursor-not-allowed opacity-55 hover:translate-y-0 hover:shadow-md;
}
</style>
