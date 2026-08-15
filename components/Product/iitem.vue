<script setup lang="ts">
import {numberFormat} from "~/utils/helper";

const props = defineProps(['product'])

const sizeRange = computed(() => {
  const colors = props.product?.colors;

  if (!colors?.length) return '';

  const sizes = colors
      .flatMap(color => color.sizes || [])
      .map(item => Number(item.size))
      .filter(size => !isNaN(size));

  if (!sizes.length) return '';

  const minSize = Math.min(...sizes);
  const maxSize = Math.max(...sizes);

  if (minSize === maxSize) {
    return `تک سایز ${minSize}`;
  }

  return `از سایز ${minSize} تا ${maxSize}`;
});
</script>
<template>

  <!-- کانتینر اصلی کارت با حاشیه سفید و گوشه‌های گرد -->
  <nuxt-link :to="`/products/${product?.slug}`">
    <div
        class="relative max-w-[400px]   rounded-[2.5rem] border-[3px] overflow-hidden shadow-lg shadow-gray-400 bg-white font-sans"
        :class="product?.is_sale?'border-cosColor':'border-white'">
      <!-- آیکون قلب (پس‌زمینه شیشه‌ای) -->


      <!-- عکس محصول -->
      <img class="w-full h-[230px] object-cover mix-blend-multiply" src="/images/preloader.png"
           v-img="product?.primary_image" :alt="product?.name || 'محصول اسلیپر پاز'">
      <!-- بخش متن و قیمت (محتوای پایین کارت) -->
      <div class="relative w-full  pt-2 bg-transparent p-4">

        <!-- عنوان محصول -->

        <h3 class="text-lg font-bold mb-1 text-mainColor">{{ product?.name || 'بدون عنوان' }}</h3>

        <p class="text-secColor text-sm" v-if="!product?.on_sale">{{ sizeRange }}</p>

        <!-- ردیف قیمت و دکمه خرید -->
        <div class="flex items-center justify-end text-left">
          <div class="flex flex-col ">
            <!-- اگر تخفیف داشت قیمت قبلی رو خط بزن -->
            <span v-if="product?.on_sale" class="text-sm line-through text-secColor/50">
             {{ numberFormat(product?.regular_price) }} تومان
          </span>
            <span class="text-xl font-bold" :class="product?.on_sale ?'text-cosColor':'text-secColor'">
             {{
                numberFormat(product?.price)
              }} تومان
          </span>
          </div>
          <!-- دکمه خرید قرصی شکل -->

        </div>


      </div>
      <i class="absolute  top-3 right-3">
        <svg
            width="40"
            height="40"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="fireGradient" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stop-color="#FF9AB0"/>
              <stop offset="55%" stop-color="#F85C87"/>
              <stop offset="100%" stop-color="#ED3970"/>
            </linearGradient>

            <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g class="fire">
            <path
                class="fire-body"
                fill="url(#fireGradient)"
                filter="url(#fireGlow)"
                d="M51.8 97
          C27.5 97 10 80.8 10 57.4
          C10 40.8 19.2 28.8 31.2 20
          C28.8 32.2 33.5 39.5 39.8 43
          C38.5 28.5 45.8 16.2 58.5 4
          C58.2 15.5 64.8 21.2 68.8 27
          C72.2 21.8 78.5 19.2 82 10
          C86.8 22.5 89.5 31.2 87.5 41
          C85.8 49.2 91 55.2 91 63.5
          C91 82.2 74.5 97 51.8 97Z"
            />

            <path
                class="fire-inner"
                fill="#fff"
                d="M51.5 85
          C40.8 85 33.5 77.8 33.5 68
          C33.5 61.2 37.2 56.2 42.2 52.2
          C41.8 59.2 45.5 62.5 49 63.8
          C48.2 56.5 52 49.8 57.8 44.5
          C57.8 51.2 62.2 54.8 64.5 59
          C66.5 55.8 69.8 53.8 71.2 49.5
          C73.5 55.5 75 60 74.5 64.5
          C74 76.5 64.2 85 51.5 85Z"
            />

            <path
                class="fire-tip"
                fill="#F85C87"
                d="M69 27
          C70 20 74 14 81 8
          C80 15 84 20 82 26
          C80 30 75 31 69 27Z"
            />
          </g>
        </svg>
      </i>

      <!-- تگ تخفیف (اختیاری - اگه خواستی نگهش داری) -->
      <div v-if="product?.on_sale"
           class="absolute bottom-16 left-2 bg-cosColor text-white text-xs font-bold  p-1 rounded-lg">
        {{ product?.discount_percent }}% کوپنـپاز

      </div>

    </div>
  </nuxt-link>
</template>

<style>
.color-product {
  @apply w-3 h-3 mx-1 rounded-full relative
}

.product-option {
  @apply absolute w-auto  p-1 rounded text-xs top-2 left-2 bg-cosColor text-center

}

.fire {
  transform-origin: 50px 90px;
  animation: fireFloat 0.8s infinite ease-in-out;
}

.fire-body {
  transform-origin: 50px 85px;
  animation: fireBody 0.55s infinite ease-in-out alternate;
}

.fire-inner {
  transform-origin: 52px 70px;
  animation: fireInner 0.35s infinite ease-in-out alternate;
}

.fire-tip {
  transform-origin: 76px 25px;
  animation: fireTip 0.45s infinite ease-in-out alternate;
}

@keyframes fireFloat {
  0% {
    transform: translateX(-1px) rotate(-1deg);
  }

  50% {
    transform: translateX(1px) rotate(1deg);
  }

  100% {
    transform: translateX(-1px) rotate(-1deg);
  }
}

@keyframes fireBody {
  0% {
    transform: scaleX(0.97) scaleY(0.98);
  }

  100% {
    transform: scaleX(1.02) scaleY(1.04);
  }
}

@keyframes fireInner {
  0% {
    transform: translate(-1px, 2px) scale(0.94);
    opacity: 0.8;
  }

  100% {
    transform: translate(1px, -1px) scale(1.03);
    opacity: 1;
  }
}

@keyframes fireTip {
  0% {
    transform: rotate(-8deg) scale(0.9);
  }

  100% {
    transform: rotate(6deg) scale(1.08);
  }
}
</style>