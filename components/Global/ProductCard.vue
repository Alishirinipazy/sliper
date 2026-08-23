<script setup lang="ts">
const props = defineProps(['dataProduct'])
const carouselRef = ref()
let timer
onMounted(() => {
  timer = window.setInterval(() => {
    if (!carouselRef.value) return
    if (carouselRef.value.page === carouselRef.value.pages) return carouselRef.value.select(0)
    carouselRef.value.next()
  }, 3500)
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <section class="product-section aqua-glass">
    <div class="section-heading">
      <div><span class="section-kicker">پیشنهادهای تازه</span><h2>تخفیف‌های داغ</h2></div>
      <NuxtLink :to="props?.dataProduct?.link" class="see-all">مشاهده همه <UIcon name="material-symbols:arrow-back-rounded"/></NuxtLink>
    </div>
    <UCarousel ref="carouselRef" dir="rtl" v-slot="{ item }" :items="[{ isStatic: true }, ...props?.dataProduct?.products || []]" :ui="{ item: 'basis-[78%] sm:basis-1/2 lg:basis-1/4' }">
      <div v-if="item.isStatic" class="px-1 h-full">
        <NuxtLink :to="props?.dataProduct?.link" class="deal-more">
          <img src="/images/cupon.png" alt="تخفیف‌های بیشتر" class="w-24 opacity-80"/>
          <span>همه تخفیف‌ها</span><small>محصولات منتخب با قیمت ویژه</small>
        </NuxtLink>
      </div>
      <div v-else class="px-1"><ProductIitem :product="item" /></div>
    </UCarousel>
  </section>
</template>

<style>
.product-section { @apply my-8 p-3 sm:p-5 rounded-[30px] overflow-hidden; }
.section-heading { @apply flex items-end justify-between gap-3 px-2 pb-4; }
.section-kicker { @apply block text-xs text-cyan-300/75 mb-1; }
.section-heading h2 { @apply text-xl sm:text-2xl font-black text-white; }
.see-all { @apply inline-flex items-center gap-1 text-sm text-cyan-200 hover:text-white transition; }
.deal-more { @apply h-full min-h-[310px] flex flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-cyan-200/20 bg-white/[.04] text-white transition hover:bg-cyan-300/[.08]; }
.deal-more span { @apply font-bold; }.deal-more small { @apply text-xs text-cyan-50/55; }
</style>