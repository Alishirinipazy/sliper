<script setup>
import {ref} from 'vue'
import {Swiper, SwiperSlide} from 'swiper/vue'
import {Navigation, Thumbs} from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import VueCountdown from '@chenfengyuan/vue-countdown';
import TypedJs from 'vue-typed-js'
const thumbsSwiper = ref(null)
const setThumbsSwiper = (swiper) => {
  thumbsSwiper.value = swiper
}
import {useModalStore} from "@/stores/cart.js";

const route = useRoute();
const {public: {apiBase}} = useRuntimeConfig();
const {data: product} = useFetch(`${apiBase}/products/${route.params.slug}`)
const {data: randomProducts} = useFetch(`${apiBase}/random-products?count=4`)
const {data: categories} = await useFetch(`${apiBase}/categories`);
const cart = useModalStore();

function endTime() {
  console.log('end')
}

function transformSlotProps(props) {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : String(value);
  });

  return formattedProps;
}

useHead({
  title: route.params.slug,
})
</script>
<template>
  <layouts-header :fixed="true"/>
  {{ product }}
  <u-container>
    <div class="grid grid-cols-12 gap-5 my-5">
      <!--the slider-->
      <div class="col-span-12 lg:col-span-4">
    <div  class=" rounded my-3 bg-cosColor/35 flex flex-row-reverse items-center justify-between px-3 shadow-2xl box-border">
      <client-only>
        <vue-countdown :time=" 24 * 60 * 60 * 1000" :transform="transformSlotProps" @end="endTime"
                       v-slot="{hours,minutes, seconds }">
          {{ seconds }} : {{ minutes }} : {{ hours }}  <icon name="material-symbols:timer"/>
        </vue-countdown>
      </client-only>
      <img src="/images/special_title_box.png" class="w-5/12" alt="">
    </div>
        <!-- main slider -->
        <Swiper
            :space-between="10"
            :thumbs="{ swiper: thumbsSwiper }"
            :modules="[Thumbs, Navigation]"
            navigation
            :loop="true"
            :autoplay="{
            delay: 3000,
            }"
            class="mySwiper2"
        >
          <SwiperSlide v-for="(img, index) in product?.data?.images" :key="index">
            <img :src="img?.image" class="rounded-xl w-full"/>
          </SwiperSlide>
        </Swiper>

        <!-- slider finger -->
        <Swiper
            @swiper="setThumbsSwiper"
            :space-between="10"
            :slides-per-view="4"
            :watch-slides-progress="true"
            :modules="[Thumbs]"
            class="mySwiper mt-4 bg-white"
        >
          <SwiperSlide v-for="(img, index) in product?.data?.images" :key="index">
            <img :src="img?.image" class="rounded-md cursor-pointer opacity-80 hover:opacity-100"/>
          </SwiperSlide>
        </Swiper>
      </div>
      <!--the detail product-->
      <div class="col-span-12 lg:col-span-5 ">
        <h4 class="text-3xl text-mainColor py-2 font-extrabold">{{ product?.data?.name }}</h4>
        <p>{{ product?.data?.description }}</p>
        <ul class="list-disc px-4 my-3">
          <li>دسته بندی : <span class="text-amber-500"> {{categories?.data?.find(item=>item?.id === product?.data?.category_id)?.name}} </span></li>

        </ul>

      </div>
      <!--the price product-->
      <div class="lg:col-span-3 bg-mainColor/35 rounded-2xl box-border shadow-2xl">

      </div>
    </div>
  </u-container>
</template>


<style>
.mySwiper2 {
  width: 100%;
}

.mySwiper {
  @apply box-border;
}

.swiper-button-next, .swiper-button-prev {
  @apply text-mainColor
}

.mySwiper img {
  @apply object-cover
}
</style>
