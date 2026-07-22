<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import VueCountdown from '@chenfengyuan/vue-countdown'
import { useModalStore } from "@/stores/cart.js"

const thumbsSwiper = ref(null)
const setThumbsSwiper = (swiper) => { thumbsSwiper.value = swiper }

const route = useRoute()
const { public: { apiBase } } = useRuntimeConfig()
const { data: productData, pending } = await useFetch(`${apiBase}/products/${route.params.slug}`)
const { data: randomProducts } = useFetch(`${apiBase}/random-products?count=4`)
const cart = useModalStore()
const toast = useToast()

const product = computed(() => productData.value?.data)

// انتخاب رنگ و سایز
const selectedColor = ref(null)
const selectedSize  = ref(null)
const quantity      = ref(1)

// وقتی رنگ عوض می‌شه، سایز ریست بشه
watch(selectedColor, () => { selectedSize.value = null; quantity.value = 1 })
watch(selectedSize, () => { quantity.value = 1 })

// وقتی محصول لود شد اولین رنگ رو انتخاب کن
watch(product, (p) => {
  if (p?.colors?.length) selectedColor.value = p.colors[0]
}, { immediate: true })

const availableSizes = computed(() => selectedColor.value?.sizes ?? [])
const currentPrice   = computed(() => selectedSize.value?.price ?? product.value?.min_price ?? 0)

// تصاویر: عکس رنگ انتخاب‌شده + تصاویر اضافی
const displayImages = computed(() => {
  const imgs = []
  if (selectedColor.value?.image) imgs.push({ image: selectedColor.value.image })
  if (product.value?.images?.length) imgs.push(...product.value.images)
  return imgs.length ? imgs : [{ image: product.value?.primary_image }]
})

function transformSlotProps(props) {
  const r = {}
  Object.entries(props).forEach(([k, v]) => { r[k] = v < 10 ? `0${v}` : String(v) })
  return r
}

function addToCart() {
  if (!selectedColor.value) { toast.add({ title: 'رنگ رو انتخاب کن', color: 'red' }); return }
  if (!selectedSize.value)  { toast.add({ title: 'سایز رو انتخاب کن',  color: 'red' }); return }
  if (selectedSize.value.quantity < 1) { toast.add({ title: 'این سایز موجود نیست', color: 'red' }); return }

  cart.addToCart(product.value, quantity.value, selectedColor.value, selectedSize.value)
  toast.add({ title: `${product.value.name} به سبد خرید اضافه شد 🛒`, color: 'green' })
  cart.changeStatusModal()
  setTimeout(cart.changeStatusModal, 1500)
}

useHead({ title: route.params.slug })

const links = [
  { label: 'خونه', to: '/' },
  { label: 'محصولاتمون', to: '/products' },
  { label: product.value?.name },
]
</script>

<template>
  <layouts-header :fixed="true"/>
  <u-container>
    <br>
    <UBreadcrumb :links="links" dir="rtl" :ui="{ active: 'text-mainColor font-semibold', base: 'font-light text-gray-400' }"/>

    <!-- اسکلت لودینگ -->
    <div v-if="pending" class="grid grid-cols-12 gap-6 my-6 animate-pulse">
      <div class="col-span-12 lg:col-span-5">
        <div class="rounded-3xl bg-gray-100 aspect-square w-full"/>
      </div>
      <div class="col-span-12 lg:col-span-4 space-y-4">
        <div class="h-8 bg-gray-100 rounded-lg w-3/4"/>
        <div class="h-4 bg-gray-100 rounded-lg w-full"/>
        <div class="h-4 bg-gray-100 rounded-lg w-5/6"/>
      </div>
      <div class="col-span-12 lg:col-span-3">
        <div class="h-64 bg-gray-100 rounded-3xl w-full"/>
      </div>
    </div>

    <div v-else class="grid grid-cols-12 gap-6 my-6">

      <!-- اسلایدر تصاویر -->
      <div class="col-span-12 lg:col-span-5">
        <div class="relative rounded-3xl overflow-hidden shadow-lg shadow-mainColor/5 ring-1 ring-black/5">
          <Swiper :space-between="10" :thumbs="{ swiper: thumbsSwiper }"
                  :modules="[Thumbs, Navigation]" navigation :loop="true" class="mySwiper2">
            <SwiperSlide v-for="(img, i) in displayImages" :key="i">
              <img :src="img.image||img.primary_image" class="w-full object-cover aspect-square"/>
            </SwiperSlide>
          </Swiper>

          <span v-if="product?.discount_percent"
                class="absolute top-4 right-4 z-10 bg-mainColor text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            {{ product.discount_percent }}٪ تخفیف
          </span>
        </div>

        <Swiper @swiper="setThumbsSwiper" :space-between="12" :slides-per-view="4"
                :watch-slides-progress="true" :modules="[Thumbs]" class="mySwiper mt-3">
          <SwiperSlide v-for="(img, i) in displayImages" :key="i">
            <img :src="img.image||img.primary_image"
                 class="rounded-xl cursor-pointer border-2 border-transparent opacity-60 hover:opacity-100 transition-all duration-200 object-cover aspect-square"/>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- جزئیات محصول -->
      <div class="col-span-12 lg:col-span-4">
        <p class="text-xs font-semibold text-mainColor/70 tracking-wide mb-1">{{ product?.category }}</p>
        <h1 class="text-2xl md:text-3xl text-secColor py-1 font-extrabold leading-snug">{{ product?.name }}</h1>


        <div class="h-px bg-gray-100 my-5"/>

        <!-- انتخاب رنگ -->
        <div class="mb-6">
          <p class="text-sm font-bold text-secColor mb-3">
            رنگ <span class="text-mainColor font-normal">· {{ selectedColor?.name }}</span>
          </p>
          <div class="flex gap-3 flex-wrap">
            <button v-for="color in product?.colors" :key="color.id"
                    @click="selectedColor = color"
                    :title="color.name"
                    type="button"
                    class="relative w-10 h-10 rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-mainColor focus-visible:ring-offset-2"
                    :class="selectedColor?.id === color.id ? 'border-mainColor scale-110 shadow-md shadow-mainColor/20' : 'border-gray-200'"
                    :style="{ background: color.color_code }">
              <span v-if="selectedColor?.id === color.id"
                    class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">✓</span>
            </button>
          </div>
        </div>

        <!-- انتخاب سایز -->
        <div class="mb-6">
          <p class="text-sm font-bold text-secColor mb-3">
            سایز <span v-if="selectedSize" class="text-mainColor font-normal">· {{ selectedSize.size }}</span>
          </p>
          <div class="flex flex-wrap gap-2">
            <button v-for="size in availableSizes" :key="size.id"
                    @click="selectedSize = size"
                    :disabled="size.quantity < 1"
                    type="button"
                    class="min-w-[46px] h-11 px-3 rounded-2xl text-sm font-bold border-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-mainColor focus-visible:ring-offset-2"
                    :class="[
                      size.quantity < 1 ? 'opacity-40 cursor-not-allowed line-through border-gray-200 text-gray-400' :
                      selectedSize?.id === size.id
                        ? 'bg-mainColor text-white border-mainColor scale-105 shadow-md shadow-mainColor/25'
                        : 'bg-white text-secColor border-gray-200 hover:border-mainColor hover:scale-105'
                    ]">
              {{ size.size }}
            </button>
          </div>
          <p v-if="!selectedColor" class="text-xs text-red-400 mt-2">ابتدا رنگ رو انتخاب کن</p>
        </div>

        <!-- تعداد -->
        <div>
          <p class="text-sm font-bold text-secColor mb-3">تعداد</p>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1 bg-gray-50 rounded-2xl p-1 border border-gray-100">
              <button @click="quantity > 1 && quantity--" type="button"
                      class="w-9 h-9 rounded-xl bg-white shadow-sm hover:bg-mainColor hover:text-white font-bold transition-colors">−</button>
              <span class="w-10 text-center font-bold text-secColor">{{ quantity }}</span>
              <button @click="selectedSize && quantity < selectedSize.quantity && quantity++" type="button"
                      class="w-9 h-9 rounded-xl bg-white shadow-sm hover:bg-mainColor hover:text-white font-bold transition-colors">+</button>
            </div>
            <span v-if="selectedSize" class="text-xs text-gray-400">{{ selectedSize.quantity }} عدد موجود</span>
          </div>
        </div>
      </div>

      <!-- قیمت و خرید -->
      <div class="price-details-product">
        <div class="hidden lg:block">
          <div class="flex justify-center mb-4">
            <img src="/images/logo.png" class="w-[150px]" alt=""/>
          </div>
          <ul class="text-sm space-y-3 text-secColor/80">
            <li class="flex items-center gap-2">
              <Icon name="streamline-plump-color:return-3-flat" class="text-lg"/> مرجوعی تا 5 روز کاری
            </li>
            <li class="flex items-center gap-2">🚚 ارسال سریع تا درب خونت</li>
            <li class="flex items-center gap-2">✨ کادو‌پیچ مجلسی</li>
            <li class="flex items-center gap-2">🛡️ ضمانت اصالت کالا تا ۱ سال</li>
          </ul>
          <div class="h-px bg-mainColor/10 my-5"/>
        </div>

        <div class="px-1">
          <!-- قیمت -->
          <div class="text-center lg:text-right mb-3">
            <p v-if="selectedSize" class="text-2xl lg:text-3xl font-extrabold text-mainColor">
              {{ numberFormat(selectedSize.price) }}
              <span class="text-sm font-medium text-secColor/60">تومان</span>
            </p>
            <p v-else-if="product?.min_price" class="text-lg font-bold text-secColor/70">
              از {{ numberFormat(product.min_price) }} تومان
            </p>
          </div>

          <!-- اخطار انتخاب نشده -->
          <div v-if="!selectedColor || !selectedSize"
               class="text-xs text-center text-amber-100 bg-amber-500/90 lg:bg-amber-600/30 lg:text-amber-200 rounded-xl px-3 py-2 mb-3 font-medium">
            {{ !selectedColor ? 'رنگ رو انتخاب کن' : 'سایز رو انتخاب کن' }}
          </div>

          <u-button color="yellow" block size="lg"
                    class="font-bold rounded-2xl shadow-lg shadow-mainColor/20 transition-transform active:scale-95"
                    @click="addToCart"
                    :disabled="!selectedColor || !selectedSize || selectedSize?.quantity < 1">
            🛒 افزودن به سبد خرید
          </u-button>
        </div>
      </div>
    </div>

    <!-- محصولات مشابه -->
    <div v-if="randomProducts?.data?.length" class="my-14">
      <div class="flex items-center gap-3 mb-6">
        <h3 class="text-xl font-extrabold text-secColor">محصولات مشابه</h3>
        <div class="h-px flex-1 bg-gray-100"/>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        <NuxtLink v-for="p in randomProducts.data" :key="p.id" :to="`/products/${p.slug}`" class="group">
          <div class="rounded-2xl overflow-hidden border border-gray-100 hover:border-mainColor/30 hover:shadow-xl hover:shadow-mainColor/5 transition-all duration-300">
            <div class="overflow-hidden">
              <img :src="p.primary_image"
                   class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"/>
            </div>
            <div class="p-3">
              <p class="text-sm font-bold text-secColor truncate">{{ p.name }}</p>
              <p class="text-mainColor text-sm font-semibold mt-1">از {{ numberFormat(p.min_price) }} تومان</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
    <p class="text-sm text-gray-500 leading-relaxed my-5">{{ product?.description }}</p>
  </u-container>
  <LayoutsFooter/>
  <!-- چت‌بات با context محصول -->

  <ClientOnly>
    <ChatBot :product="product"/>
  </ClientOnly>
</template>

<style>
.mySwiper2 { width: 100%; }

.price-details-product {
  @apply lg:col-span-3 fixed left-0 bottom-0 lg:text-secColor text-white w-screen lg:w-auto lg:relative z-20 pt-3 pb-4 lg:pb-5 px-4 lg:px-5 bg-white/95 backdrop-blur border-t border-gray-100 lg:border-t-0 lg:bg-white lg:rounded-3xl lg:shadow-xl lg:shadow-mainColor/5 lg:ring-1 lg:ring-black/5 lg:sticky lg:top-24 lg:self-start;
}

.mySwiper { @apply box-border; }

.swiper-button-next,
.swiper-button-prev {
  @apply text-mainColor;
  --swiper-navigation-size: 20px;
}
.swiper-button-next::after,
.swiper-button-prev::after {
  @apply bg-white/90 rounded-full shadow-md;
  padding: 20px;
  font-size: 14px !important;
}

.mySwiper .swiper-slide-thumb-active img {
  @apply border-mainColor opacity-100;
}

.mySwiper img { @apply object-cover; }
</style>