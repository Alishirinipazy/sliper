<script setup lang="ts">
import {numberFormat} from "~/utils/helper";

const props = defineProps(['product'])
const sizeRange = computed(() => {
  const colors = props.product?.colors
  if (!colors?.length) return ''
  const sizes = colors.flatMap(color => color.sizes || []).map(item => Number(item.size)).filter(size => !isNaN(size))
  if (!sizes.length) return ''
  const minSize = Math.min(...sizes), maxSize = Math.max(...sizes)
  return minSize === maxSize ? `تک سایز ${minSize}` : `از سایز ${minSize} تا ${maxSize}`
})
</script>

<template>
  <nuxt-link :to="`/products/${product?.slug}`" class="product-link">
    <article class="product-card" :class="{'product-sale': product?.is_sale}">
      <div class="product-image-wrap">
        <img class="product-image" src="/images/preloader.png" v-img="product?.primary_image"
             :alt="product?.name || 'محصول اسلیپر پاز'">
        <i  class="absolute left-2 top-0">
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
      </div>

      <div class="product-info">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0 "><h3>{{ product?.name || 'بدون عنوان' }}</h3>
            <p v-if="!product?.on_sale">{{ sizeRange }}</p></div>
          <span class="buy-orb"><UIcon name="material-symbols:arrow-back-rounded" class="w-5 h-5"/></span>
        </div>
        <div class="price-row">

          <span v-if="product?.on_sale" class="sale-badge">{{ product?.discount_percent }}% کوپنـ.پاز</span>
          <span class="product-shine"></span>
          <div>
            <span v-if="product?.on_sale" class="old-price">{{ numberFormat(product?.regular_price) }} تومان</span>
            <span class="price" :class="{'price-sale': product?.on_sale}">{{ numberFormat(product?.price) }} <small>تومان</small></span>
          </div>
          <p>{{product?.category}}</p>
        </div>
      </div>
    </article>
  </nuxt-link>
</template>

<style>
.product-link {
  @apply block h-full;
}

.product-card {
  @apply relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[.065] shadow-[0_14px_45px_rgba(0,7,14,.22)] transition-all duration-500 hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[.09] hover:shadow-[0_20px_55px_rgba(0,9,16,.34)];
  backdrop-filter: blur(12px);
}

.product-sale {
  @apply border-cyan-200/15;
}

.product-image-wrap {
  @apply relative m-1 overflow-hidden rounded-[24px] bg-gradient-to-b from-cyan-950/50 to-slate-950/60;
  height: 225px;
}

.product-image {
  @apply w-full h-full object-cover transition duration-700 group-hover:scale-105;
  mix-blend-mode: normal;
}

.product-shine {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(125deg, rgba(255, 255, 255, .13), transparent 28%, transparent 70%, rgba(105, 230, 255, .08));
}

.product-info {
  @apply p-2 text-right;
}

.product-info h3 {
  @apply text-base font-bold text-mainColor  truncate;
}

.product-info p {
  @apply text-xs text-cyan-50/50 mt-1;
  min-height: 1rem;
}

.heart-orb, .buy-orb {
  @apply shrink-0 flex items-center justify-center rounded-full border border-white/10 bg-white/[.07] text-cyan-100/80;
}

.heart-orb {
  @apply w-9 h-9;
}

.buy-orb {
  @apply w-10 h-10 text-cyan-200 group-hover:bg-cyan-300/20;
}

.price-row {
  @apply flex flex-row-reverse items-end justify-between gap-2 mt-4 text-left relative;
}

.old-price {
  @apply block text-[11px] line-through text-cyan-50/35 mb-0.5;
}

.price {
  @apply block text-xl font-black text-white ;
}

.price-sale {
  @apply text-cosColor;
}

.price small {
  @apply text-[10px] font-medium text-cyan-50/55;
}

.sale-badge {
  @apply absolute -top-6 left-10  z-10 rounded-full px-2.5 py-1 text-[10px] font-bold text-white bg-cosColor shadow-[0_0_18px_rgba(108,231,255,.25)];
}

@media (max-width: 640px) {
  .product-image-wrap {
    height: 205px;
  }

  .product-card {
    border-radius: 24px;
  }
}
</style>