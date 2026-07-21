<script setup>
import { useModalStore } from "~/stores/cart"

const route = useRoute()
const cart = useModalStore()

const state = ref('loading') // loading | success | failed
const message = ref('')
const refNumber = ref(null)

onMounted(async () => {
  const { trackId, success, status } = route.query

  if (!trackId) {
    state.value = 'failed'
    message.value = 'اطلاعات پرداخت ناقص است'
    return
  }

  try {
    const data = await $fetch('/api/payment/verify', {
      method: 'POST',
      body: {
        track_id: Number(trackId),
        success: Number(success ?? 0),
        status: status ? Number(status) : null,
      }
    })

    if (data?.status) {
      state.value = 'success'
      refNumber.value = data.refNumber
      cart.clear()
      await cart.fetchFromServer()
    } else {
      state.value = 'failed'
      message.value = data?.error || 'پرداخت ناموفق بود'
    }
  } catch (error) {
    state.value = 'failed'
    const backendMessage = error.data?.data?.message
    message.value = backendMessage?.error?.[0] || (typeof backendMessage === 'string' ? backendMessage : null) || 'خطا در بررسی وضعیت پرداخت'
  }
})
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

      <div v-if="state === 'loading'" class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-mainColor border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-500">در حال بررسی وضعیت پرداخت...</p>
      </div>

      <div v-else-if="state === 'success'" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <UIcon name="i-heroicons-check-circle" class="w-10 h-10 text-green-500" />
        </div>
        <h2 class="text-lg font-bold text-secColor">پرداخت با موفقیت انجام شد 🎉</h2>
        <p v-if="refNumber" class="text-xs text-gray-400">کد پیگیری: {{ refNumber }}</p>
        <NuxtLink to="/profile/orders" class="mt-2 px-6 py-2.5 bg-secColor text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
          مشاهده سفارش‌ها
        </NuxtLink>
        <NuxtLink to="/" class="text-xs text-gray-400 hover:text-mainColor transition">بازگشت به فروشگاه</NuxtLink>
      </div>

      <div v-else class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
          <UIcon name="i-heroicons-x-circle" class="w-10 h-10 text-red-500" />
        </div>
        <h2 class="text-lg font-bold text-secColor">پرداخت ناموفق بود</h2>
        <p class="text-xs text-gray-400">{{ message }}</p>
        <NuxtLink to="/" class="mt-2 px-6 py-2.5 bg-secColor text-white rounded-xl text-sm font-bold hover:opacity-90 transition">
          بازگشت به فروشگاه
        </NuxtLink>
      </div>

    </div>
  </div>
</template>
