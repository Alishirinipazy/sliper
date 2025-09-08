<script setup lang="ts">
const containerRef = ref(null)
const props = defineProps(['items', 'h', 'loading'])
const slides = ref(Array.from({length: 10}))
const swiper = useSwiper(containerRef, {
  effect: 'fade',

  loop: true,
  autoplay: {
    delay: 3000,
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
})


</script>

<template>
  <div v-if="loading">
    <USkeleton class="h-[90vh]"/>
  </div>
  <div class="relative">
    <template v-if="Array.isArray(props.items)">
      <ClientOnly>
        <swiper-container ref="containerRef" :init="false">
          <swiper-slide
              v-for="(item, idx) in items"
              :key="idx"
          >
            <div class="slider-body justify-center "
                 :class="h"
                 :style="{ backgroundImage: 'url(https://api.sliper.ir/' + item.image + ')'}">
              <h4 class="slider-title">{{ item.title }}</h4>


              <nuxt-link :to="item.link">
                <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
              </nuxt-link>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </template>
    <div v-else class="slider-body justify-end "
         style="direction: rtl" :style="{ backgroundImage: 'url(' + items.image + ')',height:h,}">
      <h4 class="slider-title ">{{ items.title }}</h4>

      <nuxt-link v-if="items.link" :to="items.link">
        <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
      </nuxt-link>
    </div>
    <div class="absolute hidden lg:block bottom-0 z-10 w-full rounded-t-full bg-white dark:bg-darkColor h-5">

    </div>
  </div>
</template>

<style lang="css">
.slider-body {
  @apply w-full rounded lg:px-12 text-center flex flex-col align-sub  lg:bg-no-repeat bg-cover bg-center py-4 text-mainColor font-bold sm:text-right
}

.slider-title {
  @apply py-2 text-3xl lg:text-4xl font-bold
}

.slider-dis {
  @apply py-2 text-cosColor
}


.swiper-horizontal > .swiper-pagination-bullets, .swiper-pagination-bullets.swiper-pagination-horizontal{
  position: absolute;
  bottom: 30px !important;
}
.swiper-pagination-bullet-active {
 background: gold !important;
}
</style>
