<script setup lang="ts">
import {numberFormat} from '~/utils/helper'

// سه کارت منتخب کنار اسلایدر: کارت‌های افقی و کم‌ارتفاع (تصویر + نام + قیمت)؛
// روی دسکتاپ زیر هم و هم‌قد اسلایدر، روی موبایل ردیف قابل‌کشیدن.
defineProps<{ products: any[]; label: string }>()
</script>

<template>
  <div class="flex min-w-0 flex-col lg:h-[min(64vh,520px)]">
    <div class="mb-2 flex items-center gap-2 px-1">
      <span class="h-2 w-2 animate-pulse rounded-full bg-mainColor"></span>
      <h2 class="text-sm font-black text-secColor">{{ label }}</h2>
    </div>

    <div class="no-scrollbar -mx-3 flex flex-1 snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-1 lg:mx-0 lg:grid lg:min-h-0 lg:grid-cols-1 lg:grid-rows-3 lg:overflow-visible lg:px-0 lg:pb-0">
      <NuxtLink v-for="(p, i) in products" :key="p.id" :to="`/products/${p.slug}`"
                class="trio-card pop-in group" :style="{'--i': i * 120}">
        <span class="trio-img">
          <img :src="p.primary_image || '/images/preloader.png'" :alt="p.name" loading="lazy"
               class="h-full w-full object-cover transition duration-700 group-hover:scale-110">
          <span v-if="p.on_sale && p.discount_percent" class="trio-badge">{{ p.discount_percent }}٪</span>
        </span>

        <span class="min-w-0 flex-1">
          <span v-if="p.category" class="block truncate text-[11px] text-gray-400">{{ p.category }}</span>
          <span class="line-clamp-2 text-sm font-black leading-6 text-secColor lg:text-base">{{ p.name }}</span>
          <span class="mt-1 flex items-baseline gap-2">
            <span class="text-sm font-black" :class="p.on_sale ? 'text-cosColor' : 'text-secColor'">
              {{ numberFormat(p.final_price ?? p.min_price) }} <small class="text-[11px] font-normal">تومان</small>
            </span>
            <span v-if="p.on_sale" class="text-xs text-gray-400 line-through">{{ numberFormat(p.regular_price) }}</span>
          </span>
        </span>

        <span class="trio-go" aria-hidden="true">
          <UIcon name="material-symbols:arrow-back-rounded" class="h-4 w-4"/>
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.trio-card {
  @apply relative flex h-[104px] w-[82%] shrink-0 snap-start items-center gap-3 rounded-3xl bg-white p-2.5 shadow-md shadow-gray-300/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:w-[60%] lg:h-auto lg:min-h-0 lg:w-auto lg:p-3;
}

.trio-img {
  @apply relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100 lg:h-[7.5rem] lg:w-[7.5rem];
}

.trio-badge {
  @apply absolute right-1 top-1 rounded-full bg-cosColor px-1.5 py-0.5 text-[10px] font-bold leading-none text-white;
}

.trio-go {
  @apply grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mainColor/20 text-secColor transition duration-300 group-hover:-translate-x-1 group-hover:bg-mainColor;
}
</style>
