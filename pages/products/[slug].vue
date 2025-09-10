<script setup lang="ts">
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
import Footer from "~/components/Layouts/Footer.vue";

const route = useRoute();
const {public: {apiBase}} = useRuntimeConfig();
const {data: product} = useFetch(`${apiBase}/products/${route.params.slug}`)
const {data: randomProducts} = useFetch(`${apiBase}/random-products?count=4`)
const {data: categories} = await useFetch(`${apiBase}/categories`);
const cart = useModalStore();
const store = useModalStore();
const quantity = ref(1)
const sexual = ref([
  {icon: "streamline:toilet-women-solid", name: 'خانم ها'},
  {icon: "ic:sharp-man", name: 'آقایون'},
  {icon: "tabler:mood-kid-filled", name: 'بچه ها'},
])



function transformSlotProps(props) {
  const formattedProps = {};

  Object.entries(props).forEach(([key, value]) => {
    formattedProps[key] = value < 10 ? `0${value}` : String(value);
  });

  return formattedProps;
}

const sizes = ref([38, 39, 40, 41, 42, 43])

function addToCart(product) {
  store?.changeStatusModal()
  cart.remove(product.id);
  cart.addToCart(product, quantity.value);
  setTimeout(store?.changeStatusModal, 2000)
}

useHead({
  title: route.params.slug,
})
const links = [{
  label: 'خوونه',
  to: '/'
}, {
  label: 'محصولاتمون',
  to:'/products'
}, {
  label: product?.value?.data?.name,

}]
</script>
<template>
  <layouts-header :fixed="true"/>
  <u-container>
    <br>
    <UBreadcrumb :links="links" :ui="{active:'text-mainColor',base:'font-light'}" />
    <div class="grid grid-cols-12 gap-5 my-3 ">
      <!--the slider-->
      <div class="col-span-12 lg:col-span-4">
        <div
            class=" rounded my-3 bg-cosColor/35 flex flex-row-reverse items-center justify-between px-3 shadow-2xl box-border">
          <client-only>
            <vue-countdown :time=" 24 * 60 * 60 * 1000" :transform="transformSlotProps"
                           v-slot="{hours,minutes, seconds }">
              {{ seconds }} : {{ minutes }} : {{ hours }}
              <icon name="material-symbols:timer"/>
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
        <ul class="list-disc gap-1 list-outside px-4 my-3 ">
          <li class="my-1">دسته بندی : <span
              class="text-amber-500"> {{
              categories?.data?.find(item => item?.id === product?.data?.category_id)?.name
            }} </span>
          </li>
          <li class="my-1">نوع محصول :
            <span class="text-mainColor">دمپایی پولیشی پاپا</span>
          </li>
          <li class="my-1">
            مناسب برای :
            <ul class="flex justify-center m-1">
              <li v-for="item in sexual" class="border rounded-2xl mx-1 border-mainColor flex items-center p-1">
                <UIcon :name="item?.icon"/>
                {{ item?.name }}
              </li>
            </ul>
          </li>
          <li class="my-1">رنگ های <span class="text-mainColor">{{ product?.data?.name }}</span> :
            <ul class="flex gap-3 mt-2 justify-center mr-8 text-amber-50">
              <li>
                <button class="w-5 h-5 rounded-full bg-cosColor border-2 border-mainColor">
                  *
                </button>
              </li>
              <li>
                <button class="w-5 h-5 rounded-full bg-gray-500 "></button>
              </li>
              <li>
                <button class="w-5 h-5 rounded-full bg-pink-300"></button>
              </li>
              <li>
                <button class="w-5 h-5 rounded-full bg-blue-500"></button>
              </li>
            </ul>
          </li>
          <li class="my-1">
            سایز های <span class="text-mainColor">{{ product?.data?.name }}</span> :
            <ul class="flex justify-center mt-2 gap-3">
              <li v-for="(size,item) in sizes">
                <button class="rounded-2xl  w-10 h-10 text-amber-50 bg-gray-500 hover:bg-gray-300 transition">
                  {{ size }}
                </button>
              </li>
            </ul>
          </li>
        </ul>

      </div>
      <!--the price product-->
      <div class="price-details-product">
        <div class="hidden lg:block">
          <p class="text-sm">گردآوری با عشق توسط :</p>
          <div class="flex justify-center"><img src="/images/logo.png" class="w-[130px]" alt=""></div>
          <ul class="text-sm mt-20">
            <li class="flex items-center my-2">
              <Icon name="streamline-plump-color:return-3-flat"/>
              <h5 class="mr-1">این کالا تا دو روز کاری قابل مرجوعی میباشد</h5>
            </li>
            <UDivider size="sm"/>
            <li class="flex items-center my-2">
              <h5 class="">🚚 ارسال سریع تا درب خونت</h5>
            </li>
            <UDivider size="sm"/>
            <li class="flex items-center my-2">
              <h5 class="">✨ کادو پیج مجلسی</h5>
            </li>
            <UDivider size="sm"/>
            <li class="flex items-center my-2">
              <h5 class="">✨ با ضمانت رویان کالا تا 1 سال </h5>
            </li>
          </ul>
        </div>
        <div class="lg:mt-8">
          <div v-if="product?.data?.is_sale" class="mb-3 ">
            <div class="flex justify-between items-center  relative">
              <del>{{ numberFormat(product?.data?.price) }} تومان</del>
              <div class="">
                {{ numberFormat(product?.data?.sale_price) }}
                تومان
                <p class="absolute bottom-5 text-sm -left-2 -rotate-12 bg-cosColor p-1 rounded text-white">
                  {{ salePercent(product?.data?.price, product?.data?.sale_price) }} %
                </p>
              </div>
            </div>
          </div>
          <h5 v-else class="text-left">
            {{ numberFormat(product?.data?.price) }} تومان
          </h5>


          <u-button color="yellow" block @click="addToCart(product?.data)">افزودن به سبد خرید</u-button>

        </div>
      </div>
    </div>
  </u-container>
      <LayoutsFooter/>
</template>


<style>
.mySwiper2 {
  width: 100%;
}

.price-details-product {
  @apply lg:col-span-3 fixed left-0 bottom-12 lg:text-secColor text-white w-screen lg:w-auto lg:relative z-20 pt-2 px-2 bg-secColor  lg:bg-mainColor/35 lg:rounded-2xl lg:box-border lg:shadow-2xl lg:bottom-0
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
