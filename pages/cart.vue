<script setup lang="ts">
import { useModalStore } from "~/stores/cart"

useSeoMeta({
  title: 'سبد خرید',
  description: 'محصولات داخل سبد خریدت رو مرور کن، روش ارسال و آدرس رو انتخاب کن و سفارشت رو نهایی کن.',
})

const toast = useToast()
const store = useModalStore()

const allCard    = computed(() => store?.allItem)
const totalItems = computed(() => allCard.value?.reduce((s, i) => s + i.qty, 0) ?? 0)

const coupon = reactive({ code: '', percent: 0 })
const addressId = ref(null)

// روش ارسال - لیست واقعی تاپین بر اساس شهر آدرس انتخابی (قیمت‌ها فرق می‌کنن،
// پس تا آدرس مشخص نشه چیزی نمی‌گیریم)
const shippingOptions  = ref([])
const selectedShipping = ref(null)
const shippingLoading  = ref(false)
const shippingError    = ref('')

watch(addressId, async (id) => {
  selectedShipping.value = null
  shippingOptions.value = []
  shippingError.value = ''
  if (!id) return
  shippingLoading.value = true
  try {
    const data = await $fetch('/api/tapin/shipping-options', { query: { address_id: id } })
    shippingOptions.value = data?.options ?? []
    if (shippingOptions.value.length) selectedShipping.value = shippingOptions.value[0]
  } catch (error) {
    shippingError.value = error.data?.statusMessage || 'امکان ارسال به این آدرس در حال حاضر وجود ندارد'
  } finally {
    shippingLoading.value = false
  }
})

const shippingPrice  = computed(() => selectedShipping.value?.price ?? 0)
const subTotal       = computed(() => store.totalAmount)
const couponDiscount = computed(() => Math.round((subTotal.value * coupon.percent) / 100))
const finalTotal     = computed(() => subTotal.value - couponDiscount.value + shippingPrice.value)

function removeFromCart(item) {
  store.remove(item._key)
  toast.add({ title: `${item.name} حذف شد`, color: 'red', timeout: 2000 })
}
</script>

<template>
  <LayoutsHeader fixed="true"/>

  <u-container class="py-4">

    <!-- بردکرامب + عنوان -->
    <p class="text-xs text-gray-400 mb-2">
      <nuxt-link to="/" class="hover:text-mainColor">خانه</nuxt-link> / <span class="text-mainColor">سبد خرید</span>
    </p>
    <h1 class="text-2xl font-extrabold text-secColor mb-6">
      سبد خرید <span v-if="totalItems" class="text-mainColor text-base font-bold">({{ totalItems }} کالا)</span>
    </h1>

    <!-- سبد خالی -->
    <div v-if="!allCard?.length" class="flex flex-col items-center justify-center py-24 gap-4">
      <img src="/images/cart-svgrepo-com.png" class="w-28 opacity-40" alt="سبد خرید خالی"/>
      <p class="text-gray-400">سبد خریدت خالیه 🥲</p>
      <nuxt-link to="/products">
        <u-button color="yellow" class="font-bold rounded-full px-8">مشاهده محصولات</u-button>
      </nuxt-link>
    </div>

    <!-- چیدمان اصلی: آیتم‌ها (راست/بزرگ) + خلاصه‌ی سفارش (چپ/ثابت) -->
    <div v-else class="grid lg:grid-cols-3 gap-6 items-start">

      <!-- ستون آیتم‌ها -->
      <div class="lg:col-span-2 bg-white rounded-3xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
        <div v-for="item in allCard" :key="item._key"
             class="flex gap-4 p-4 hover:bg-gray-50 transition">

          <img :src="item.selectedColor?.image || item.primary_image || '/images/preloader.png'"
               :alt="item.name" class="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover flex-shrink-0 border border-gray-100"/>

          <div class="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <p class="font-bold text-secColor truncate">{{ item.name }}</p>
              <div class="flex items-center gap-2 mt-1.5">
                <span v-if="item.selectedColor"
                      class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      :style="{ background: item.selectedColor.color_code }"
                      :title="item.selectedColor.name"/>
                <span v-if="item.selectedColor" class="text-xs text-gray-500">{{ item.selectedColor.name }}</span>
                <span v-if="item.selectedSize"
                      class="text-xs bg-secColor text-mainColor px-2 py-0.5 rounded-full font-bold">
                  سایز {{ item.selectedSize.size }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between mt-2">
              <div class="flex items-center gap-1 bg-gray-100 rounded-full px-1">
                <button @click="item.qty > 1 && store.dicrement(item._key)"
                        class="w-7 h-7 rounded-full hover:bg-mainColor hover:text-white text-lg font-bold flex items-center justify-center transition">−</button>
                <span class="w-7 text-center text-sm font-bold">{{ item.qty }}</span>
                <button @click="store.increment(item._key)"
                        class="w-7 h-7 rounded-full hover:bg-mainColor hover:text-white text-lg font-bold flex items-center justify-center transition">+</button>
              </div>
              <span class="font-bold text-secColor">
                {{ numberFormat(item.selectedPrice * item.qty) }} تومان
              </span>
            </div>
          </div>

          <button @click="removeFromCart(item)"
                  class="text-gray-300 hover:text-cosColor self-start transition">
            <UIcon name="i-heroicons-x-mark-20-solid" class="w-5 h-5"/>
          </button>
        </div>
      </div>

      <!-- ستون خلاصه‌ی سفارش -->
      <div class="lg:sticky lg:top-4 flex flex-col gap-4">

        <!-- ۱. آدرس -->
        <div class="bg-white rounded-3xl border border-gray-100 p-4">
          <p class="text-sm font-bold text-secColor mb-3">۱. آدرس گیرنده</p>
          <CartAddress @set-address-id="(id) => addressId = id"/>
        </div>

        <!-- ۲. روش ارسال -->
        <div class="bg-white rounded-3xl border border-gray-100 p-4">
          <p class="text-sm font-bold text-secColor mb-3">۲. روش ارسال</p>

          <p v-if="!addressId" class="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 text-center">
            اول آدرس رو انتخاب کن تا هزینه‌های ارسال نشون داده بشه
          </p>
          <div v-else-if="shippingLoading" class="space-y-2">
            <USkeleton class="h-12 w-full rounded-xl" v-for="n in 3" :key="n"/>
          </div>
          <p v-else-if="shippingError" class="text-xs text-red-400 bg-red-50 rounded-xl p-3 text-center">
            {{ shippingError }}
          </p>
          <div v-else class="space-y-2">
            <label v-for="option in shippingOptions" :key="option.order_type"
                   class="flex items-center justify-between p-3 rounded-xl border cursor-pointer transition"
                   :class="selectedShipping?.order_type === option.order_type ? 'border-mainColor bg-mainColor/10' : 'border-gray-200 hover:border-gray-300'">
              <div class="flex items-center gap-2">
                <input type="radio" :value="option.order_type" :checked="selectedShipping?.order_type === option.order_type"
                       @change="selectedShipping = option" class="accent-yellow-400"/>
                <div>
                  <p class="text-sm font-bold">{{ option.title }}</p>
                  <p class="text-xs text-gray-400">{{ option.eta }}</p>
                </div>
              </div>
              <span class="text-sm font-bold" :class="option.price === 0 ? 'text-green-500' : 'text-secColor'">
                {{ option.price === 0 ? 'رایگان' : numberFormat(option.price) + ' ت' }}
              </span>
            </label>
          </div>
        </div>

        <!-- ۳. کد تخفیف -->
        <div class="bg-white rounded-3xl border border-gray-100 p-4">
          <p class="text-sm font-bold text-secColor mb-3">۳. کد تخفیف</p>
          <CartCoupon :coupon="coupon"/>
        </div>

        <!-- ۴. جمع‌بندی و پرداخت -->
        <div class="bg-secColor rounded-3xl p-4 text-white">
          <p class="text-sm font-bold text-mainColor mb-3">۴. جمع‌بندی سفارش</p>
          <ul class="text-sm divide-y divide-white/10">
            <li class="flex justify-between py-2">
              <span>جمع کالاها</span>
              <span>{{ numberFormat(subTotal) }} تومان</span>
            </li>
            <li v-if="coupon.percent" class="flex justify-between py-2 text-cosColor">
              <span>تخفیف {{ coupon.percent }}٪</span>
              <span>- {{ numberFormat(couponDiscount) }} تومان</span>
            </li>
            <li class="flex justify-between py-2">
              <span>هزینه ارسال</span>
              <span :class="shippingPrice === 0 ? 'text-green-400' : ''">
                {{ selectedShipping ? (shippingPrice === 0 ? 'رایگان' : numberFormat(shippingPrice) + ' تومان') : '—' }}
              </span>
            </li>
            <li class="flex justify-between py-3 font-extrabold text-mainColor text-base">
              <span>مبلغ نهایی</span>
              <span>{{ numberFormat(finalTotal) }} تومان</span>
            </li>
          </ul>

          <CartPayment
              :coupon="coupon"
              :addressId="addressId"
              :cart="allCard"
              :tapinOrderType="selectedShipping?.order_type"/>
        </div>
      </div>
    </div>
  </u-container>

  <LayoutsFooter/>
</template>