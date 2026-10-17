<script setup lang="ts">
import {numberFormat} from '~/utils/helper'

// سه کارت کنار اسلایدر (طبق طرح): منتخب‌های همین ویزیت
defineProps<{ products: any[]; label: string }>()
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="mb-2 flex items-center gap-2 px-1">
      <span class="h-2 w-2 animate-pulse rounded-full bg-mainColor"></span>
      <h2 class="text-sm font-black text-secColor">{{ label }}</h2>
    </div>

    <div class="no-scrollbar -mx-3 flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0">
      <NuxtLink v-for="(p, i) in products" :key="p.id" :to="`/products/${p.slug}`"
                class="trio-card pop-in group" :style="{'--i': i * 120}">
        <img :src="p.primary_image || '/images/preloader.png'" :alt="p.name" loading="lazy"
             class="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110">
        <div class="absolute inset-0 bg-gradient-to-t from-secColor/90 via-secColor/10 to-transparent"></div>

        <span v-if="p.on_sale && p.discount_percent" class="absolute right-2 top-2 rounded-full bg-cosColor px-2 py-0.5 text-[11px] font-bold text-white">
          {{ p.discount_percent }}٪
        </span>

        <div class="absolute inset-x-0 bottom-0 p-3 text-white">
          <p class="truncate text-xs font-bold lg:text-sm">{{ p.name }}</p>
          <p class="mt-0.5 text-xs text-mainColor">{{ numberFormat(p.final_price ?? p.min_price) }} تومان</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.trio-card {
  @apply relative block min-h-[200px] w-[42%] shrink-0 snap-start overflow-hidden rounded-3xl bg-slate-300 shadow-lg shadow-gray-400/50 transition duration-300 hover:-translate-y-1 lg:min-h-0 lg:w-auto;
}
</style>
