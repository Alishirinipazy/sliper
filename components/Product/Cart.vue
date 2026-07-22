<script setup lang="ts">
import { useModalStore } from "~/stores/cart"

const { authUser } = useAuth()
const toast = useToast()
const store = useModalStore()
const { public: { apiBase } } = useRuntimeConfig()

const allCard    = computed(() => store?.allItem)
const totalItems = computed(() => allCard.value?.reduce((s, i) => s + i.qty, 0) ?? 0)

// روش ارسال
const { data: shippingMethods } = await useFetch(`${apiBase}/shipping-methods`)
const selectedShipping = ref(null)
watch(shippingMethods, (v) => {
    if (v?.data?.length && !selectedShipping.value) selectedShipping.value = v.data[0]
}, { immediate: true })

const shippingPrice  = computed(() => selectedShipping.value?.price ?? 0)
const subTotal       = computed(() => store.totalAmount)
const couponDiscount = computed(() => Math.round((subTotal.value * coupon.percent) / 100))
const finalTotal     = computed(() => subTotal.value - couponDiscount.value + shippingPrice.value)

const coupon = reactive({ code: '', percent: 0 })
const addressId = ref(null)

function removeFromCart(item) {
    store.remove(item._key)
    toast.add({ title: `${item.name} حذف شد`, color: 'red', timeout: 2000 })
}
</script>

<template>
  <ClientOnly>
    <UCard class="flex flex-col flex-1 h-full"
           :ui="{ body: { base: 'flex-1 overflow-y-auto' }, ring: '', divide: 'divide-y divide-gray-100' }">

      <!-- هدر -->
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-base text-secColor">سبد خرید</h3>
            <p v-if="totalItems" class="text-xs text-mainColor">{{ totalItems }} محصول</p>
          </div>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                   @click="store.changeStatusModal()"/>
        </div>
      </template>

      <!-- لیست محصولات -->
      <div class="flex flex-col h-full">
        <ul v-if="allCard?.length" class="divide-y divide-gray-100 overflow-y-auto max-h-[40vh]">
          <li v-for="item in allCard" :key="item._key"
              class="flex gap-3 py-3 px-1 hover:bg-gray-50 transition">


            <NuxtImg
                :src="item.selectedColor?.image || item.primary_image || '/images/preloader.png'"
                class="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"
                width="200"
                format="avif"
                quality="100"
            />
            <!-- اطلاعات -->
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm text-secColor truncate">{{ item.name }}</p>

              <!-- رنگ و سایز -->
              <div class="flex items-center gap-2 mt-1">
                <span v-if="item.selectedColor"
                      class="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                      :style="{ background: item.selectedColor.color_code }"
                      :title="item.selectedColor.name">
                </span>
                <span v-if="item.selectedColor" class="text-xs text-gray-500">{{ item.selectedColor.name }}</span>
                <span v-if="item.selectedSize"
                      class="text-xs bg-secColor text-mainColor px-2 py-0.5 rounded-full font-bold">
                  {{ item.selectedSize.size }}
                </span>
              </div>

              <!-- تعداد + قیمت -->
              <div class="flex items-center justify-between mt-2">
                <div class="flex items-center gap-1 bg-gray-100 rounded-full px-1">
                  <button @click="item.qty > 1 && store.dicrement(item._key)"
                          class="w-6 h-6 rounded-full hover:bg-mainColor hover:text-white text-lg font-bold flex items-center justify-center transition">−</button>
                  <span class="w-6 text-center text-sm font-bold">{{ item.qty }}</span>
                  <button @click="store.increment(item._key)"
                          class="w-6 h-6 rounded-full hover:bg-mainColor hover:text-white text-lg font-bold flex items-center justify-center transition">+</button>
                </div>
                <span class="text-sm font-bold text-secColor">
                  {{ numberFormat(item.selectedPrice * item.qty) }} تومان
                </span>
              </div>
            </div>

            <!-- حذف -->
            <button @click="removeFromCart(item)"
                    class="text-gray-300 hover:text-cosColor self-start mt-1 transition">
              <UIcon name="i-heroicons-x-mark-20-solid" class="w-4 h-4"/>
            </button>
          </li>
        </ul>

        <!-- خالی بودن سبد -->
        <div v-else class="flex flex-col items-center justify-center py-10 gap-3">
          <NuxtImg
              src="/images/cart-svgrepo-com.png"
              width="96"
              height="96"
          />
          <p class="text-gray-400 text-sm">سبد خریدت خالیه 🥲</p>
        </div>
      </div>

      <!-- فوتر -->
      <template #footer v-if="allCard?.length">

        <!-- روش ارسال -->
        <div class="py-2">
          <p class="text-xs font-bold text-secColor mb-2">روش ارسال:</p>
          <div class="space-y-1">
            <label v-for="method in shippingMethods?.data" :key="method.id"
                   class="flex items-center justify-between p-2 rounded-xl border cursor-pointer transition"
                   :class="selectedShipping?.id === method.id ? 'border-mainColor bg-mainColor/10' : 'border-gray-200 hover:border-gray-300'">
              <div class="flex items-center gap-2">
                <input type="radio" :value="method.id" :checked="selectedShipping?.id === method.id"
                       @change="selectedShipping = method" class="accent-yellow-400"/>
                <div>
                  <p class="text-xs font-bold">{{ method.name }}</p>
                  <p class="text-xs text-gray-400">{{ method.delivery_days }} روز کاری</p>
                </div>
              </div>
              <span class="text-xs font-bold" :class="method.price === 0 ? 'text-green-500' : 'text-secColor'">
                {{ method.price === 0 ? 'رایگان' : numberFormat(method.price) + ' ت' }}
              </span>
            </label>
          </div>
        </div>

        <!-- کوپن -->
        <CartCoupon :coupon="coupon"/>

        <!-- محاسبه قیمت -->
        <ul class="bg-secColor rounded-2xl text-white text-sm divide-y divide-white/10 overflow-hidden my-2">
          <li class="flex justify-between px-3 py-2">
            <span>جمع کالاها</span>
            <span>{{ numberFormat(subTotal) }} تومان</span>
          </li>
          <li v-if="coupon.percent" class="flex justify-between px-3 py-2 text-cosColor">
            <span>تخفیف {{ coupon.percent }}٪</span>
            <span>- {{ numberFormat(couponDiscount) }} تومان</span>
          </li>
          <li class="flex justify-between px-3 py-2">
            <span>هزینه ارسال</span>
            <span :class="shippingPrice === 0 ? 'text-green-400' : ''">
              {{ shippingPrice === 0 ? 'رایگان' : numberFormat(shippingPrice) + ' تومان' }}
            </span>
          </li>
          <li class="flex justify-between px-3 py-2 font-bold text-mainColor">
            <span>مبلغ نهایی</span>
            <span>{{ numberFormat(finalTotal) }} تومان</span>
          </li>
        </ul>

        <!-- آدرس و پرداخت -->
        <div class="grid grid-cols-2 gap-2 mt-2">
          <CartAddress @set-address-id="(id) => addressId = id"/>
          <CartPayment
              :coupon="coupon"
              :addressId="addressId"
              :cart="allCard"
              :shippingMethodId="selectedShipping?.id"/>
        </div>
      </template>
    </UCard>
  </ClientOnly>
</template>
