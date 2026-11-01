<script setup lang="ts">
// بخش بالای صفحه اصلی: اسلایدر بزرگ + سه محصول منتخب (طبق طرح).
// افکت اسکرول (مثل مایکروسافت استور): با پایین رفتن صفحه، این بخش کمی کوچک و محو می‌شود
// و «برگه‌ی» محتوای بعدی با لبه‌ی گرد از روی آن بالا می‌آید؛ با برگشتن، دوباره بزرگ می‌شود.
const props = defineProps<{ slides: any[]; trio: any[]; trioLabel: string }>()

const containerRef = ref<HTMLElement | null>(null)
useSwiper(containerRef, {
  loop: true,
  effect: 'fade',
  speed: 900,
  autoplay: {delay: 4500, disableOnInteraction: false},
  pagination: {clickable: true},
})

const stage = ref<HTMLElement | null>(null)
const progress = ref(0)

onMounted(() => {
  let raf = 0
  const update = () => {
    raf = 0
    const h = stage.value?.offsetHeight || 1
    progress.value = Math.min(1, Math.max(0, window.scrollY / (h * 0.9)))
  }
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(update)
  }
  window.addEventListener('scroll', onScroll, {passive: true})
  update()
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    if (raf) cancelAnimationFrame(raf)
  })
})

const stageStyle = computed(() => ({
  transform: `translateY(${progress.value * -18}px) scale(${1 - progress.value * 0.07})`,
  opacity: String(1 - progress.value * 0.6),
  transformOrigin: 'center top',
}))
</script>

<template>
  <div ref="stage" class="hero-stage" :style="stageStyle">
    <div class="grid gap-3 lg:grid-cols-[1.35fr_1fr]">
      <!-- اسلایدر -->
      <div class="hero-slider">
        <ClientOnly>
          <swiper-container v-if="slides?.length" ref="containerRef" :init="false" class="h-full w-full">
            <swiper-slide v-for="(item, i) in slides" :key="i">
              <div class="slide">
                <img :src="item.file" :alt="item.title || 'اسلیپر پاز'" class="slide-img" :loading="i === 0 ? 'eager' : 'lazy'">
                <div class="slide-shade"></div>
                <div class="slide-copy">
                  <h2 class="text-2xl font-black text-white drop-shadow lg:text-4xl">{{ item.title }}</h2>
                  <NuxtLink v-if="item.link" :to="item.link">
                    <UButton class="mt-3 rounded-full" label="همین الان بخرش" color="yellow" size="lg"/>
                  </NuxtLink>
                </div>
              </div>
            </swiper-slide>
          </swiper-container>
          <div v-else class="shimmer h-full w-full"></div>

          <template #fallback>
            <div class="slide">
              <img v-if="slides?.[0]" :src="slides[0].file" :alt="slides[0].title || 'اسلیپر پاز'" class="slide-img">
              <div class="slide-shade"></div>
              <div class="slide-copy">
                <h2 class="text-2xl font-black text-white drop-shadow lg:text-4xl">{{ slides?.[0]?.title }}</h2>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- سه محصول منتخب -->
      <HomeFeaturedTrio v-if="trio?.length" :products="trio" :label="trioLabel"/>
    </div>
  </div>
</template>

<style scoped>
.hero-stage {
  @apply mx-auto w-full max-w-[1400px] px-3 will-change-transform;
}

.hero-slider {
  @apply relative h-[38vh] min-h-[230px] overflow-hidden rounded-[2rem] bg-secColor shadow-xl shadow-gray-500/40 lg:h-[min(64vh,520px)];
  --swiper-pagination-color: #ffbe33;
  --swiper-pagination-bullet-inactive-color: #fff;
}

.slide {
  @apply relative h-full w-full overflow-hidden;
}

.slide-img {
  @apply absolute inset-0 h-full w-full object-cover;
}

:deep(.swiper-slide-active) .slide-img {
  animation: kenburns 6s ease-out both;
}

.slide-shade {
  @apply absolute inset-0 bg-gradient-to-t from-secColor/80 via-secColor/10 to-transparent;
}

.slide-copy {
  @apply absolute inset-x-0 bottom-0 p-5 pb-10 text-right lg:p-10 lg:pb-14;
}
</style>
