<script setup>
import {useModalStore} from "~/stores/cart"

const props = defineProps({preview: {type: Boolean, default: false}})
const {authUser} = useAuth()
const toast = useToast()
const store = useModalStore()
const {public: {apiBase}} = useRuntimeConfig()

const allCard = computed(() => store?.allItem)
const totalItems = computed(() => allCard.value?.reduce((s, i) => s + i.qty, 0) ?? 0)
const previewItems = computed(() => allCard.value?.slice(0, 3) ?? [])
const {data: shippingMethods} = await useFetch(`${apiBase}/shipping-methods`)
const selectedShipping = ref(null)
watch(shippingMethods, (v) => {
  if (v?.data?.length && !selectedShipping.value) selectedShipping.value = v.data[0]
}, {immediate: true})

const shippingPrice = computed(() => selectedShipping.value?.price ?? 0)
const subTotal = computed(() => store.totalAmount)
const coupon = reactive({code: '', percent: 0})
const couponDiscount = computed(() => Math.round((subTotal.value * coupon.percent) / 100))
const finalTotal = computed(() => subTotal.value - couponDiscount.value + shippingPrice.value)
const addressId = ref(null)

function removeFromCart(item) {
  store.remove(item._key)
  toast.add({title: `${item.name} حذف شد`, color: 'yellow', timeout: 2000})
}
</script>

<template>
  <div :class="!props.preview && allCard?.length?'grid lg:grid-cols-12 p-3':''">
    <ClientOnly>
      <UCard class="lg:col-span-7 cart-shell flex flex-col flex-1 h-full p-3"
             :ui="{ base: 'bg-transparent', header: 'border-mainColor/10', body: { base: 'flex-1 overflow-y-auto bg-transparent' }, footer: 'border-mainColor/10 bg-transparent', ring: 'ring-0', divide: 'divide-mainColor/10', shadow: 'shadow-none' }">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div><h3 class="font-black text-base text-white">سبد خرید</h3>
              <p v-if="totalItems" class="text-xs text-mainColor mt-1">{{ totalItems }} محصول</p></div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid"
                     class="text-white/60 hover:text-mainColor" @click="store.changeStatusModal()"/>
          </div>
        </template>

        <div class="flex flex-col h-full">
          <ul v-if="allCard?.length" class="divide-y divide-mainColor/10 overflow-y-auto"
              :class="props.preview ? 'max-h-[58vh]' : 'max-h-[40vh]'">
            <li v-for="item in (props.preview ? previewItems : allCard)" :key="item._key"
                class="flex gap-3 py-3 px-1 rounded-xl hover:bg-mainColor/5 transition">
              <img :src="item.selectedColor?.image || item.primary_image || '/images/preloader.png'" :alt="item.name"
                   class="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-mainColor/15"/>
              <div class="flex-1 min-w-0"><p class="font-bold text-sm text-white truncate">{{ item.name }}</p>
                <div class="flex items-center gap-2 mt-1"><span v-if="item.selectedColor"
                                                                class="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                                                                :style="{ background: item.selectedColor.color_code }"></span><span
                    v-if="item.selectedColor" class="text-xs text-white/50">{{ item.selectedColor.name }}</span><span
                    v-if="item.selectedSize"
                    class="text-xs bg-secColor text-mainColor px-2 py-0.5 rounded-full font-bold">{{
                    item.selectedSize.size
                  }}</span></div>
                <div class="flex items-center justify-between mt-2">
                  <div class="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-1">
                    <button @click="item.qty > 1 && store.dicrement(item._key)"
                            class="w-6 h-6 rounded-full hover:bg-mainColor hover:text-secColor text-lg font-bold flex items-center justify-center transition">
                      −
                    </button>
                    <span class="w-6 text-center text-sm font-bold text-white">{{ item.qty }}</span>
                    <button @click="store.increment(item._key)"
                            class="w-6 h-6 rounded-full hover:bg-mainColor hover:text-secColor text-lg font-bold flex items-center justify-center transition">
                      +
                    </button>
                  </div>
                  <span class="text-sm font-bold text-mainColor">{{
                      numberFormat(item.selectedPrice * item.qty)
                    }} تومان</span></div>
              </div>
              <button @click="removeFromCart(item)"
                      class="text-white/25 hover:text-mainColor self-start mt-1 transition">
                <UIcon name="i-heroicons-x-mark-20-solid" class="w-4 h-4"/>
              </button>
            </li>
          </ul>

          <div v-else class="flex flex-col items-center justify-center py-10 gap-3"><img
              src="/images/cart-svgrepo-com.png" class="w-24 opacity-40" alt=""/>
            <p class="text-white/50 text-sm">سبد خریدت خالیه 🥲</p></div>

          <div v-if="props.preview && allCard?.length" class="mt-auto pt-4">
            <div v-if="allCard.length > previewItems.length" class="text-xs text-white/45 mb-3 text-center">
              {{ allCard.length - previewItems.length }} محصول دیگر در سبد داری
            </div>
            <div class="cart-preview-total"><span class="text-sm text-white/60">جمع سبد</span><strong
                class="text-lg text-mainColor">{{ numberFormat(subTotal) }} تومان</strong></div>
            <NuxtLink to="/cart" class="cart-continue" @click="store.changeStatusModal()">ادامه و مشاهده سبد خرید
              <UIcon name="material-symbols:arrow-back-rounded" class="w-5 h-5"/>
            </NuxtLink>
          </div>
        </div>

        <template #footer v-if="!props.preview && allCard?.length">

        </template>
      </UCard>

    </ClientOnly>
    <div class="lg:col-span-5" v-if="!props.preview && allCard?.length">
      <div class="py-2"><p class="text-xs font-bold text-mainColor mb-2">روش ارسال:</p>
        <div class="space-y-1"><label v-for="method in shippingMethods?.data" :key="method.id"
                                      class="flex items-center justify-between p-2 rounded-xl border border-white/10 bg-white/[.03] cursor-pointer transition"
                                      :class="selectedShipping?.id === method.id ? 'border-mainColor bg-mainColor/10' : 'hover:border-mainColor/30'">
          <div class="flex items-center gap-2"><input type="radio" :value="method.id"
                                                      :checked="selectedShipping?.id === method.id"
                                                      @change="selectedShipping = method" class="accent-mainColor"/>
            <div><p class="text-xs font-bold text-white">{{ method.name }}</p>
              <p class="text-xs text-white/40">{{ method.delivery_days }} روز کاری</p></div>
          </div>
          <span class="text-xs font-bold" :class="method.price === 0 ? 'text-green-400' : 'text-white/70'">{{
              method.price === 0 ? 'رایگان' : numberFormat(method.price) + ' ت'
            }}</span></label></div>
      </div>
      <CartCoupon :coupon="coupon"/>
      <ul class="bg-secColor rounded-2xl text-white text-sm divide-y divide-white/10 overflow-hidden my-2">
        <li class="flex justify-between px-3 py-2"><span>جمع کالاها</span><span>{{
            numberFormat(subTotal)
          }} تومان</span></li>
        <li v-if="coupon.percent" class="flex justify-between px-3 py-2 text-cosColor"><span>تخفیف {{
            coupon.percent
          }}٪</span><span>- {{ numberFormat(couponDiscount) }} تومان</span></li>
        <li class="flex justify-between px-3 py-2"><span>هزینه ارسال</span><span
            :class="shippingPrice === 0 ? 'text-green-400' : ''">{{
            shippingPrice === 0 ? 'رایگان' : numberFormat(shippingPrice) + ' تومان'
          }}</span></li>
        <li class="flex justify-between px-3 py-2 font-bold text-mainColor">
          <span>مبلغ نهایی</span><span>{{ numberFormat(finalTotal) }} تومان</span></li>
      </ul>
      <div class="grid grid-cols-2 gap-2 mt-2">
        <CartAddress @set-address-id="(id) => addressId = id"/>
        <CartPayment :coupon="coupon" :addressId="addressId" :cart="allCard"
                     :shippingMethodId="selectedShipping?.id"/>
      </div>
    </div>
  </div>
</template>

<style>
.cart-shell {
  background: linear-gradient(160deg, #071b24 0%, #111b20 52%, #1c1b22 100%);
  color: white;
}

.cart-preview-total {
  @apply flex items-center justify-between  border border-mainColor/15 bg-mainColor/5 px-4 py-3 mb-3;
}

.cart-continue {
  @apply w-full min-h-12  bg-mainColor text-secColor font-black flex items-center justify-center gap-2 shadow-[0_12px_32px_rgba(255,190,51,.18)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(255,190,51,.28)];
}
</style>