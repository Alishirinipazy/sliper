<script setup lang="ts">
import { useModalStore } from "~/stores/cart"

const toast = useToast()
const store = useModalStore()

const allCard    = computed(() => store?.allItem)
const totalItems = computed(() => allCard.value?.reduce((s, i) => s + i.qty, 0) ?? 0)
const finalTotal = computed(() => store.totalAmount)

function removeFromCart(item) {
  store.remove(item._key)
  toast.add({ title: `${item.name} حذف شد`, color: 'red', timeout: 2000 })
}

function goToCheckout() {
  store.changeStatusModal()
  navigateTo('/cart')
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

      <!-- نمونه‌ی محصولات سبد -->
      <div class="flex flex-col h-full">
        <ul v-if="allCard?.length" class="divide-y divide-gray-100 overflow-y-auto">
          <li v-for="item in allCard" :key="item._key"
              class="flex gap-3 py-3 px-1 hover:bg-gray-50 transition">

            <img :src="item.selectedColor?.image || item.primary_image || '/images/preloader.png'"
                 :alt="item.name" class="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-gray-100"/>

            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm text-secColor truncate">{{ item.name }}</p>

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

              <div class="flex items-center justify-between mt-2">
                <span class="text-xs text-gray-400">{{ item.qty }} عدد</span>
                <span class="text-sm font-bold text-secColor">
                  {{ numberFormat(item.selectedPrice * item.qty) }} تومان
                </span>
              </div>
            </div>

            <button @click="removeFromCart(item)"
                    class="text-gray-300 hover:text-cosColor self-start mt-1 transition">
              <UIcon name="i-heroicons-x-mark-20-solid" class="w-4 h-4"/>
            </button>
          </li>
        </ul>

        <!-- خالی بودن سبد -->
        <div v-else class="flex flex-col items-center justify-center py-10 gap-3">
          <img src="/images/cart-svgrepo-com.png" class="w-24 opacity-40" alt=""/>
          <p class="text-gray-400 text-sm">سبد خریدت خالیه 🥲</p>
        </div>
      </div>

      <!-- فوتر: فقط جمع نهایی + دکمه‌ی رفتن به صفحه‌ی تسویه‌حساب -->
      <template #footer v-if="allCard?.length">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm text-gray-500">جمع کل</span>
          <span class="text-lg font-extrabold text-mainColor">{{ numberFormat(finalTotal) }} تومان</span>
        </div>
        <UButton color="yellow" block size="lg" class="font-extrabold rounded-2xl" @click="goToCheckout">
          مشاهده سبد و تسویه‌حساب
        </UButton>
      </template>
    </UCard>
  </ClientOnly>
</template>