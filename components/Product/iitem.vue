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
        <img class="product-image" src="/images/preloader.png" v-img="product?.primary_image" :alt="product?.name || 'محصول اسلیپر پاز'">
        <span v-if="product?.on_sale" class="sale-badge">{{ product?.discount_percent }}% تخفیف</span>
        <span class="product-shine"></span>
      </div>

      <div class="product-info">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0"><h3>{{ product?.name || 'بدون عنوان' }}</h3><p v-if="!product?.on_sale">{{ sizeRange }}</p></div>
          <span class="heart-orb" aria-hidden="true"><UIcon name="material-symbols:favorite-outline-rounded" class="w-4 h-4"/></span>
        </div>
        <div class="price-row">
          <div>
            <span v-if="product?.on_sale" class="old-price">{{ numberFormat(product?.regular_price) }} تومان</span>
            <span class="price" :class="{'price-sale': product?.on_sale}">{{ numberFormat(product?.price) }} <small>تومان</small></span>
          </div>
          <span class="buy-orb"><UIcon name="material-symbols:arrow-back-rounded" class="w-5 h-5"/></span>
        </div>
      </div>
    </article>
  </nuxt-link>
</template>

<style>
.product-link { @apply block h-full; }
.product-card { @apply relative h-full overflow-hidden rounded-[28px] border border-white/10 bg-white/[.065] shadow-[0_14px_45px_rgba(0,7,14,.22)] transition-all duration-500 hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[.09] hover:shadow-[0_20px_55px_rgba(0,9,16,.34)]; backdrop-filter: blur(12px); }
.product-sale { @apply border-cyan-200/15; }
.product-image-wrap { @apply relative m-1 overflow-hidden rounded-[24px] bg-gradient-to-b from-cyan-950/50 to-slate-950/60; height: 225px; }
.product-image { @apply w-full h-full object-cover transition duration-700 group-hover:scale-105; mix-blend-mode: normal; }
.product-shine { position:absolute; inset:0; pointer-events:none; background: linear-gradient(125deg, rgba(255,255,255,.13), transparent 28%, transparent 70%, rgba(105,230,255,.08)); }
.product-info { @apply p-3.5 sm:p-4 text-right; }
.product-info h3 { @apply text-base font-bold text-white truncate; }
.product-info p { @apply text-xs text-cyan-50/50 mt-1; min-height: 1rem; }
.heart-orb, .buy-orb { @apply shrink-0 flex items-center justify-center rounded-full border border-white/10 bg-white/[.07] text-cyan-100/80; }
.heart-orb { @apply w-9 h-9; }.buy-orb { @apply w-10 h-10 text-cyan-200 group-hover:bg-cyan-300/20; }
.price-row { @apply flex items-end justify-between gap-2 mt-4; }
.old-price { @apply block text-[11px] line-through text-cyan-50/35 mb-0.5; }
.price { @apply block text-lg font-black text-white; }.price-sale { @apply text-cyan-200; }.price small { @apply text-[10px] font-medium text-cyan-50/55; }
.sale-badge { @apply absolute top-3 right-3 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold text-slate-950 bg-cyan-200/90 shadow-[0_0_18px_rgba(108,231,255,.25)]; }
@media (max-width: 640px) { .product-image-wrap { height: 205px; } .product-card { border-radius: 24px; } }
</style>