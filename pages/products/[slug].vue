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
const { data: productData } = await useFetch(`${apiBase}/products/${route.params.slug}`)
const { data: randomProducts } = useFetch(`${apiBase}/random-products?count=4`)
const cart = useModalStore()
const toast = useToast()

const product = computed(() => productData.value?.data)

// انتخاب رنگ و سایز
const selectedColor = ref(null)
const selectedSize  = ref(null)
const quantity      = ref(1)

// وقتی رنگ عوض می‌شه، سایز ریست بشه
watch(selectedColor, () => { selectedSize.value = null })

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
    setTimeout(cart.changeStatusModal, 2500)
}

useHead({ title: route.params.slug })

const links = [
    { label: 'خوونه', to: '/' },
    { label: 'محصولاتمون', to: '/products' },
    { label: product.value?.name },
]
</script>

<template>
  <layouts-header :fixed="true"/>
  <u-container>
    <br>
    <UBreadcrumb dir="rtl" :links="links" :ui="{ active: 'text-mainColor', base: 'font-light' }"/>

    <div class="grid grid-cols-12 gap-5 my-3">

      <!-- اسلایدر تصاویر -->
      <div class="col-span-12 lg:col-span-4">
        <div class="rounded my-3 bg-cosColor/35 flex flex-row-reverse items-center justify-between px-3 shadow-2xl">
          <client-only>
            <vue-countdown :time="24 * 60 * 60 * 1000" :transform="transformSlotProps"
                           v-slot="{ hours, minutes, seconds }">
              {{ seconds }} : {{ minutes }} : {{ hours }}
              <icon name="material-symbols:timer"/>
            </vue-countdown>
          </client-only>
          <img src="/images/special_title_box.png" class="w-5/12" alt=""/>
        </div>

        <Swiper :space-between="10" :thumbs="{ swiper: thumbsSwiper }"
                :modules="[Thumbs, Navigation]" navigation :loop="true" class="mySwiper2">
          <SwiperSlide v-for="(img, i) in displayImages" :key="i">
            <img :src="img.primary_image" class="rounded-xl w-full object-cover aspect-square"/>
          </SwiperSlide>
        </Swiper>

        <Swiper @swiper="setThumbsSwiper" :space-between="10" :slides-per-view="4"
                :watch-slides-progress="true" :modules="[Thumbs]" class="mySwiper mt-4">
          <SwiperSlide v-for="(img, i) in displayImages" :key="i">

            <img :src="img.primary_image" class="rounded-md cursor-pointer opacity-70 hover:opacity-100 object-cover aspect-square"/>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- جزئیات محصول -->
      <div class="col-span-12 lg:col-span-5">
        <h4 class="text-3xl text-mainColor py-2 font-extrabold">{{ product?.name }}</h4>


        <ul class="list-disc gap-1 list-outside px-4 my-4">
          <li class="my-2">دسته‌بندی:
            <span class="text-mainColor font-semibold">{{ product?.category }}</span>
          </li>

          <!-- انتخاب رنگ -->
          <li class="my-3">
            رنگ: <span class="text-mainColor font-semibold">{{ selectedColor?.name }}</span>
            <div class="flex gap-3 mt-2 flex-wrap">
              <div v-for="color in product?.colors" :key="color.id"
                      @click="selectedColor = color"
                      :title="color.name"
                      class="relative w-32  h-[80px]  border-2 transition-all duration-200 hover:scale-110 bg-cover bg-center"
                      :class="selectedColor?.id === color.id ? 'border-mainColor scale-110 shadow-lg' : 'border-gray-300'"
                      :style="{ backgroundImage: 'url(' + color.image + ')'}">
                <span v-if="selectedColor?.id === color.id"
                      class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">✓</span>

              </div>
            </div>
          </li>npm install -D wrangler

          <!-- انتخاب سایز -->
          <li class="my-3">
            سایز:
            <span v-if="selectedSize" class="text-mainColor font-semibold">{{ selectedSize.size }}</span>
            <div class="flex flex-wrap gap-2 mt-2">
              <button v-for="size in availableSizes" :key="size.id"
                      @click="selectedSize = size"
                      :disabled="size.quantity < 1"
                      class="min-w-[44px] h-11 px-2 rounded-xl text-sm font-bold border-2 transition-all duration-200"
                      :class="[
                        size.quantity < 1 ? 'opacity-40 cursor-not-allowed line-through border-gray-200 text-gray-400' :
                        selectedSize?.id === size.id
                          ? 'bg-secColor text-mainColor border-mainColor scale-105 shadow-md'
                          : 'bg-white text-secColor border-gray-300 hover:border-mainColor hover:scale-105'
                      ]">
                {{ size.size }}
                <div v-if="size.quantity < 1" class="text-xs font-normal">ناموجود</div>
              </button>
            </div>
            <p v-if="!selectedColor" class="text-xs text-red-400 mt-1">ابتدا رنگ انتخاب کن</p>
          </li>

          <!-- تعداد -->
          <li class="my-3">
            تعداد:
            <div class="flex items-center gap-3 mt-2">
              <button @click="quantity > 1 && quantity--"
                      class="w-8 h-8 rounded-full bg-gray-200 hover:bg-mainColor hover:text-white font-bold transition">−</button>
              <span class="w-8 text-center font-bold text-lg">{{ quantity }}</span>
              <button @click="selectedSize && quantity < selectedSize.quantity && quantity++"
                      class="w-8 h-8 rounded-full bg-gray-200 hover:bg-mainColor hover:text-white font-bold transition">+</button>
              <span v-if="selectedSize" class="text-xs text-gray-400">({{ selectedSize.quantity }} عدد موجود)</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- قیمت و خرید -->
      <div class="price-details-product">
        <div class="hidden lg:block">
          <p class="text-sm">گردآوری با عشق توسط:</p>
          <div class="flex justify-center"><img src="/images/logo.png" class="w-[130px]" alt=""/></div>
          <ul class="text-sm mt-10 space-y-2">
            <li class="flex items-center gap-1"><Icon name="streamline-plump-color:return-3-flat"/> مرجوعی تا ۲ روز کاری</li>
            <UDivider size="sm"/>
            <li>🚚 ارسال سریع تا درب خونت</li>
            <UDivider size="sm"/>
            <li>✨ کادو پیج مجلسی</li>
            <UDivider size="sm"/>
            <li>✨ ضمانت رویان کالا تا ۱ سال</li>
          </ul>
        </div>

        <div class="lg:mt-6 px-1">
          <!-- قیمت -->
          <div class="text-left mb-3">
            <p v-if="selectedSize" class="text-2xl font-extrabold text-mainColor">
              {{ numberFormat(selectedSize.price) }} تومان
            </p>
            <p v-else-if="product?.min_price" class="text-lg font-bold text-gray-600">
              از {{ numberFormat(product.min_price) }} تومان
            </p>
          </div>

          <!-- اخطار انتخاب نشده -->
          <div v-if="!selectedColor || !selectedSize"
               class="text-xs text-center text-amber-200 bg-amber-600/30 rounded-lg px-2 py-1 mb-2">
            {{ !selectedColor ? 'رنگ رو انتخاب کن' : 'سایز رو انتخاب کن' }}
          </div>

          <u-button color="yellow" block @click="addToCart"
                    :disabled="!selectedColor || !selectedSize || selectedSize?.quantity < 1">
            🛒 افزودن به سبد خرید
          </u-button>
        </div>
      </div>
    </div>
    <p class="text-sm text-gray-600 leading-relaxed">{{ product?.description }}</p>
    <!-- محصولات مشابه -->
    <div v-if="randomProducts?.data?.length" class="my-10">
      <h3 class="text-xl font-bold text-secColor mb-4">محصولات مشابه</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink v-for="p in randomProducts.data" :key="p.id" :to="`/products/${p.slug}`">
          <div class="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition">
            <img :src="p.primary_image" class="w-full aspect-square object-cover"/>
            <div class="p-2">
              <p class="text-sm font-bold truncate">{{ p.name }}</p>
              <p class="text-mainColor text-sm">از {{ numberFormat(p.min_price) }} تومان</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </u-container>
  <LayoutsFooter/>
</template>

<style>
.mySwiper2 { width: 100%; }
.price-details-product {
  @apply lg:col-span-3 fixed left-0 bottom-12 lg:text-secColor text-white w-screen lg:w-auto lg:relative z-20 pt-2 px-2 bg-secColor lg:bg-mainColor/35 lg:rounded-2xl lg:shadow-2xl lg:bottom-0
}
.mySwiper { @apply box-border; }
.swiper-button-next, .swiper-button-prev { @apply text-mainColor }
.mySwiper img { @apply object-cover }
</style>
