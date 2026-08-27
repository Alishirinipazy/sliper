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
      <div class="flex">
        <svg
            v-if="props.dataProduct?.type=='sale'"
            width="50"
            height="50"
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


        <div><span class="section-kicker">پیشنهادهای تازه</span>
          <h2 ><span class="text-cosColor">کوپنـ.پاز</span> تا 50 درصد تخفیف</h2></div>
      </div>
      <NuxtLink :to="props?.dataProduct?.link" class="see-all">مشاهده همه
        <UIcon name="material-symbols:arrow-back-rounded"/>
      </NuxtLink>
    </div>
    <UCarousel ref="carouselRef" dir="rtl" v-slot="{ item }" :items="props?.dataProduct?.products">

      <div class="px-1">
        <ProductIitem :product="item"/>
      </div>
    </UCarousel>
  </section>
</template>

<style>
.product-section {
  @apply my-8 p-3 sm:p-5 rounded-[30px] overflow-hidden;
}

.section-heading {
  @apply flex items-end justify-between gap-3 px-2 pb-4;
}

.section-kicker {
  @apply block text-xs text-cyan-300/75 mb-1;
}

.section-heading h2 {
  @apply text-xl sm:text-2xl font-black text-white;
}

.see-all {
  @apply inline-flex items-center gap-1 text-sm text-cyan-200 hover:text-white transition;
}

.deal-more {
  @apply h-full min-h-[310px] flex flex-col items-center justify-center gap-2 rounded-[28px] border border-dashed border-cyan-200/20 bg-white/[.04] text-white transition hover:bg-cyan-300/[.08];
}

.deal-more span {
  @apply font-bold;
}

.deal-more small {
  @apply text-xs text-cyan-50/55;
}
</style>