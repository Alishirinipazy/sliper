<script setup lang="ts">
import {numberFormat} from "~/utils/helper";

const props = defineProps(['product'])
const sizeRange = computed(() => {
  const variants = props.product?.variants;
  if (!variants || variants.length === 0) return '';
  const firstSize = variants[0]?.size;
  const lastSize = variants[variants.length - 1]?.size;
  if (!variants || variants.length === 1) return `تک سایز ${firstSize} `;

  return firstSize === lastSize ? `سایز ${firstSize}` : `از سایز ${firstSize} تا ${lastSize}`;
});
console.log(props.product)
</script>
<template>

  <!-- کانتینر اصلی کارت با حاشیه سفید و گوشه‌های گرد -->

  <div
      class="relative max-w-[400px]   rounded-[2.5rem] border-[5px] overflow-hidden shadow-lg shadow-gray-400 bg-gradient-to-b from-[#f9e6e6] to-[rgba(۳۴,۴۰,۴cls
      ۹,0.49)] text-white font-sans"
      :class="product?.is_sale?'border-cosColor':'border-white'">
    <!-- آیکون قلب (پس‌زمینه شیشه‌ای) -->
    <button
        class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-2xl bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 transition">
      <UIcon name="heroicons:heart" class="w-6 h-6"/> <!-- اگر از NuxtIcon استفاده می‌کنی اسمش رو عوض کن -->
    </button>

    <!-- عکس محصول -->

    <NuxtImg
        class="w-full h-[230px] object-cover mix-blend-multiply" src="/images/preloader.png"
        v-img="product?.primary_image" alt=""
        width="200"
        format="webp"
        quality="100"
    />
    <!-- بخش متن و قیمت (محتوای پایین کارت) -->
    <div class="relative w-full  pt-2 bg-transparent p-4">

      <!-- عنوان محصول -->
      <nuxt-link :to="`/products/${product?.slug}`">
        <h3 class="text-md font-bold mb-1 text-mainColor">{{ product?.name || 'بدون عنوان' }}</h3>
      </nuxt-link>


      <!-- ردیف قیمت و دکمه خرید -->
      <div class="flex items-center justify-between ">
        <div class="flex flex-col">
          <!-- اگر تخفیف داشت قیمت قبلی رو خط بزن -->
          <span v-if="product?.is_sale" class="text-md line-through text-red-600/70">
             {{ numberFormat(product?.price) }} تومان
          </span>
          <span class="text-xl font-bold text-secColor">
             {{
              product?.value?.is_sale ? numberFormat(product?.sale_price) : numberFormat(product?.price)
            }} تومان
          </span>
        </div>
        <!-- دکمه خرید قرصی شکل -->

      </div>

        <p class="text-cosColor text-sm">{{ sizeRange }}</p>


    </div>
    <UButton disabled class=" bg-white text-gray-900 font-bold rounded-tr-full hover:bg-gray-100 transition shadow-sm px-8 absolute -left-4 text-right bottom-0"
        align="left">
      <UIcon name="iconamoon:shopping-card-add-bold" class="text-xl"/>
    </UButton>

    <!-- تگ تخفیف (اختیاری - اگه خواستی نگهش داری) -->
    <div v-if="product?.is_sale"
         class="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
      %{{ Math.round((product?.value?.price - product?.sale_price) / product?.price * 100) }}
    </div>

  </div>
</template>

<style>
.color-product {
  @apply w-3 h-3 mx-1 rounded-full relative
}

.product-option {
  @apply absolute w-auto  p-1 rounded text-xs top-2 left-2 bg-cosColor text-center

}
</style>