<script setup lang="ts">
import { useModalStore } from "~/stores/cart"

const props = defineProps({ preview: { type: Boolean, default: false } })
const { authUser } = useAuth()
const toast = useToast()
const store = useModalStore()

const allCard = computed(() => store?.allItem ?? [])
const totalItems = computed(() => allCard.value.reduce((s, i) => s + i.qty, 0))
const previewItems = computed(() => allCard.value.slice(0, 3))

const coupon = reactive({ code: '', percent: 0 })
const addressId = ref<number | null>(null)
const shippingOptions = ref<any[]>([])
const selectedShipping = ref<any | null>(null)
const shippingLoading = ref(false)
const shippingError = ref('')

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
  } catch (error: any) {
    shippingError.value = error?.data?.statusMessage || 'امکان ارسال به این آدرس در حال حاضر وجود ندارد'
  } finally {
    shippingLoading.value = false
  }
})

const shippingPrice = computed(() => selectedShipping.value?.price ?? 0)
const subTotal = computed(() => store.totalAmount)
const couponDiscount = computed(() => Math.round((subTotal.value * coupon.percent) / 100))
const finalTotal = computed(() => subTotal.value - couponDiscount.value + shippingPrice.value)

function removeFromCart(item: any) {
  store.remove(item._key)
  toast.add({ title: `${item.name} حذف شد`, color: 'yellow', timeout: 2000 })
}
</script>

<template>
  <ClientOnly>
    <div dir="rtl" class="cart-component" :class="preview ? 'cart-component-preview' : 'cart-component-full'">
      <UCard class="cart-shell flex flex-col h-full"
        :ui="{ base: 'bg-transparent', header: 'border-mainColor/10', body: { base: 'flex-1 overflow-y-auto bg-transparent' }, footer: 'border-mainColor/10 bg-transparent', ring: 'ring-0', divide: 'divide-mainColor/10', shadow: 'shadow-none' }">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div>
              <h3 class="font-black text-base text-white">سبد خرید</h3>
              <p v-if="totalItems" class="text-xs text-mainColor mt-1">{{ totalItems }} محصول</p>
            </div>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="text-white/60 hover:text-mainColor" @click="store.changeStatusModal()" />
          </div>
        </template>

        <div class="flex flex-col min-h-0 h-full">
          <ul v-if="allCard.length" class="cart-items divide-y divide-mainColor/10 overflow-y-auto">
            <li v-for="item in (preview ? previewItems : allCard)" :key="item._key" class="cart-item flex gap-3 py-3 px-1 rounded-xl hover:bg-mainColor/5 transition">
              <img :src="item.selectedColor?.image || item.primary_image || '/images/preloader.png'" :alt="item.name" class="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-mainColor/15" />
              <div class="flex-1 min-w-0">
                <p class="font-bold text-sm text-white truncate">{{ item.name }}</p>
                <div class="flex items-center gap-2 mt-1 flex-wrap">
                  <span v-if="item.selectedColor" class="w-4 h-4 rounded-full border border-white/20 flex-shrink-0" :style="{ background: item.selectedColor.color_code }" />
                  <span v-if="item.selectedColor" class="text-xs text-white/50">{{ item.selectedColor.name }}</span>
                  <span v-if="item.selectedSize" class="text-xs bg-secColor text-mainColor px-2 py-0.5 rounded-full font-bold">{{ item.selectedSize.size }}</span>
                </div>
                <div class="flex items-center justify-between gap-2 mt-2 flex-wrap">
                  <div class="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-1">
                    <button @click="item.qty > 1 && store.dicrement(item._key)" class="w-7 h-7 rounded-full hover:bg-mainColor hover:text-secColor text-lg font-bold flex items-center justify-center transition">−</button>
                    <span class="w-6 text-center text-sm font-bold text-white">{{ item.qty }}</span>
                    <button @click="store.increment(item._key)" class="w-7 h-7 rounded-full hover:bg-mainColor hover:text-secColor text-lg font-bold flex items-center justify-center transition">+</button>
                  </div>
                  <span class="text-sm font-bold text-mainColor whitespace-nowrap">{{ numberFormat(item.selectedPrice * item.qty) }} تومان</span>
                </div>
              </div>
              <button @click="removeFromCart(item)" class="text-white/25 hover:text-mainColor self-start mt-1 transition" aria-label="حذف محصول">
                <UIcon name="i-heroicons-x-mark-20-solid" class="w-4 h-4" />
              </button>
            </li>
          </ul>

          <div v-else class="flex flex-col items-center justify-center py-10 gap-3">
            <img src="/images/cart-svgrepo-com.png" class="w-24 opacity-40" alt="" />
            <p class="text-white/50 text-sm">سبد خریدت خالیه 🥲</p>
          </div>

          <div v-if="preview && allCard.length" class="mt-auto pt-4">
            <div v-if="allCard.length > previewItems.length" class="text-xs text-white/45 mb-3 text-center">{{ allCard.length - previewItems.length }} محصول دیگر در سبد داری</div>
            <div class="cart-preview-total"><span class="text-sm text-white/60">جمع سبد</span><strong class="text-lg text-mainColor">{{ numberFormat(subTotal) }} تومان</strong></div>
            <NuxtLink to="/cart" class="cart-continue" @click="store.changeStatusModal()">
              ادامه و مشاهده سبد خرید
              <UIcon name="material-symbols:arrow-back-rounded" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>

        <template #footer v-if="!preview && allCard.length">
          <div class="cart-checkout-grid">
            <section class="cart-checkout-side">
              <p class="text-xs font-bold text-mainColor mb-2">روش ارسال</p>
              <p v-if="!addressId" class="cart-hint">اول آدرس رو انتخاب کن تا هزینه‌های ارسال نشون داده بشه</p>
              <div v-else-if="shippingLoading" class="space-y-2"><USkeleton v-for="n in 2" :key="n" class="h-12 w-full rounded-xl" /></div>
              <p v-else-if="shippingError" class="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-3">{{ shippingError }}</p>
              <div v-else-if="shippingOptions.length" class="space-y-2">
                <label v-for="option in shippingOptions" :key="option.order_type" class="shipping-option" :class="selectedShipping?.order_type === option.order_type ? 'shipping-option-active' : ''">
                  <div class="flex items-center gap-2 min-w-0">
                    <input type="radio" :value="option.order_type" :checked="selectedShipping?.order_type === option.order_type" @change="selectedShipping = option" class="accent-mainColor" />
                    <div class="min-w-0"><p class="text-xs font-bold text-white truncate">{{ option.title }}</p><p class="text-xs text-white/40">{{ option.eta }}</p></div>
                  </div>
                  <span class="text-xs font-bold whitespace-nowrap" :class="option.price === 0 ? 'text-green-400' : 'text-white/70'">{{ option.price === 0 ? 'رایگان' : numberFormat(option.price) + ' ت' }}</span>
                </label>
              </div>
            </section>

            <section class="cart-checkout-side">
              <CartCoupon :coupon="coupon" />
              <ul class="cart-total-list">
                <li><span>جمع کالاها</span><span>{{ numberFormat(subTotal) }} تومان</span></li>
                <li v-if="coupon.percent" class="text-cosColor"><span>تخفیف {{ coupon.percent }}٪</span><span>- {{ numberFormat(couponDiscount) }} تومان</span></li>
                <li><span>هزینه ارسال</span><span :class="shippingPrice === 0 ? 'text-green-400' : ''">{{ shippingPrice === 0 ? 'رایگان' : numberFormat(shippingPrice) + ' تومان' }}</span></li>
                <li class="font-bold text-mainColor"><span>مبلغ نهایی</span><span>{{ numberFormat(finalTotal) }} تومان</span></li>
              </ul>
            </section>
          </div>
          <div class="cart-payment-grid">
            <CartAddress @set-address-id="(id) => addressId = id" />
            <CartPayment :coupon="coupon" :addressId="addressId" :cart="allCard" :tapinOrderType="selectedShipping?.order_type" />
          </div>
        </template>
      </UCard>
    </div>
  </ClientOnly>
</template>

<style>
.cart-component { min-width: 0; width: 100%; }
.cart-component-preview { min-height: 100%; }
.cart-component-full { padding: clamp(.5rem, 1.5vw, 1rem); }
.cart-shell { background: linear-gradient(160deg, #071b24 0%, #111b20 52%, #1c1b22 100%); color: white; border: 1px solid rgba(255,190,51,.12); border-radius: 24px; overflow: hidden; }
.cart-items { max-height: min(52vh, 620px); scrollbar-width: thin; scrollbar-color: rgba(255,190,51,.35) transparent; }
.cart-item { align-items: flex-start; }
.cart-preview-total { @apply flex items-center justify-between gap-3 border border-mainColor/15 bg-mainColor/5 rounded-2xl px-4 py-3 mb-3; }
.cart-continue { @apply w-full min-h-12 rounded-2xl bg-mainColor text-secColor font-black flex items-center justify-center gap-2 shadow-[0_12px_32px_rgba(255,190,51,.18)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(255,190,51,.28)]; }
.cart-checkout-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 1rem; }
.cart-checkout-side { min-width: 0; }
.cart-hint { @apply text-xs text-white/45 bg-white/[.03] border border-white/10 rounded-xl p-3; }
.shipping-option { @apply flex items-center justify-between gap-3 p-3 rounded-xl border border-white/10 bg-white/[.03] cursor-pointer transition; }
.shipping-option-active { @apply border-mainColor bg-mainColor/10; }
.cart-total-list { @apply bg-secColor rounded-2xl text-white text-sm divide-y divide-white/10 overflow-hidden my-2; }
.cart-total-list li { @apply flex justify-between gap-3 px-4 py-3; }
.cart-payment-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: .75rem; margin-top: .75rem; }
@media (max-width: 767px) {
  .cart-component-full { padding: .35rem; }
  .cart-shell { border-radius: 20px; }
  .cart-items { max-height: none; }
  .cart-checkout-grid, .cart-payment-grid { grid-template-columns: 1fr; }
  .cart-item { gap: .65rem; }
  .cart-item > img { width: 3.5rem; height: 3.5rem; }
}
</style>