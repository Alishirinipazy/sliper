<script setup>
const { data, pending } = await useFetch('/api/profile/orders', {
    headers: useRequestHeaders(['cookie'])
})

const orders = computed(() => data.value?.orders ?? [])
const expanded = ref(null)

const statusMap = {
    0: { label: 'در انتظار پرداخت', color: 'bg-gray-400',    icon: '🕐' },
    1: { label: 'پرداخت شده',        color: 'bg-blue-400',    icon: '💳' },
    2: { label: 'در حال پردازش',     color: 'bg-yellow-400',  icon: '⚙️' },
    3: { label: 'آماده ارسال',        color: 'bg-indigo-400',  icon: '📦' },
    4: { label: 'ارسال شد',           color: 'bg-cyan-500',    icon: '🚚' },
    5: { label: 'تحویل داده شد',      color: 'bg-green-500',   icon: '✅' },
    6: { label: 'لغو شد',             color: 'bg-red-500',     icon: '❌' },
    7: { label: 'مرجوع شد',           color: 'bg-gray-700',    icon: '↩️' },
}
</script>

<template>
  <div class="border-2 rounded-2xl mx-3 my-2">
    <div class="flex justify-between items-center p-4 border-b">
      <h5 class="font-bold text-xl text-mainColor">سفارش‌ها</h5>
      <p class="text-sm text-gray-400">جزئیات خریدهاتو اینجا ببین</p>
    </div>

    <div v-if="pending" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-mainColor"/>
    </div>

    <div v-else-if="!orders.length" class="text-center py-10 text-gray-400">
      <p class="text-4xl mb-2">🛍️</p>
      <p>هنوز هیچ سفارشی نداری</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div v-for="order in orders" :key="order.id" class="p-4">

        <!-- سر سفارش -->
        <div class="flex flex-wrap gap-3 items-center justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-xs text-gray-400">سفارش #{{ order.id }}</span>
            <span class="text-xs text-gray-400">{{ order.created_at }}</span>
          </div>

          <!-- نوار وضعیت -->
          <div class="flex items-center gap-1 overflow-x-auto max-w-full py-1">
            <template v-for="(info, step) in statusMap" :key="step">
              <!-- فقط ۶ مرحله اول (نه لغو/مرجوع) -->
              <template v-if="step <= 5">
                <div class="flex flex-col items-center gap-1 min-w-[48px]">
                  <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-all"
                       :class="[
                         order.order_status >= step
                           ? info.color + ' border-transparent text-white'
                           : 'bg-gray-100 border-gray-200 text-gray-300',
                         order.order_status === step ? 'ring-2 ring-offset-1 ring-mainColor scale-110' : ''
                       ]">
                    {{ info.icon }}
                  </div>
                  <span class="text-[9px] text-gray-400 text-center leading-tight" style="max-width:48px">
                    {{ info.label }}
                  </span>
                </div>
                <div v-if="step < 5"
                     class="w-5 h-0.5 mb-4 flex-shrink-0 transition-all"
                     :class="order.order_status > step ? 'bg-mainColor' : 'bg-gray-200'">
                </div>
              </template>
            </template>
          </div>

          <!-- لغو / مرجوع -->
          <span v-if="order.order_status === 6 || order.order_status === 7"
                :class="['text-xs px-2 py-1 rounded-full text-white', statusMap[order.order_status]?.color]">
            {{ statusMap[order.order_status]?.icon }} {{ statusMap[order.order_status]?.label }}
          </span>

          <!-- قیمت و جزئیات -->
          <div class="flex items-center gap-3">
            <span class="font-bold text-secColor">{{ numberFormat(order.paying_amount) }} تومان</span>
            <button @click="expanded = expanded === order.id ? null : order.id"
                    class="text-xs text-mainColor border border-mainColor rounded-full px-3 py-1 hover:bg-mainColor hover:text-white transition">
              {{ expanded === order.id ? 'بستن' : 'جزئیات' }}
            </button>
          </div>
        </div>

        <!-- جزئیات -->
        <div v-if="expanded === order.id" class="mt-4 bg-gray-50 rounded-2xl p-3">
          <!-- آدرس و ارسال -->
          <div class="text-xs text-gray-500 mb-3 space-y-1">
            <p>📍 آدرس: {{ order.address_title }}</p>
            <p v-if="order.shipping_method">🚚 روش ارسال: {{ order.shipping_method.name }}</p>
          </div>

          <!-- آیتم‌ها -->
          <div class="space-y-2">
            <div v-for="item in order.order_items" :key="item.id"
                 class="flex gap-3 bg-white rounded-xl p-2 border border-gray-100">
              <img :src="item.color?.image || item.product_primary_image"
                   class="w-12 h-12 rounded-lg object-cover flex-shrink-0"/>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold truncate">{{ item.product_name }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span v-if="item.color" class="flex items-center gap-1 text-xs text-gray-500">
                    <span class="w-3 h-3 rounded-full border"
                          :style="{ background: item.color.color_code }"></span>
                    {{ item.color.name }}
                  </span>
                  <span v-if="item.size"
                        class="text-xs bg-secColor text-mainColor px-1.5 py-0.5 rounded-full">
                    {{ item.size.size }}
                  </span>
                  <span class="text-xs text-gray-400">× {{ item.quantity }}</span>
                </div>
              </div>
              <span class="text-sm font-bold text-secColor flex-shrink-0">
                {{ numberFormat(item.subtotal) }} ت
              </span>
            </div>
          </div>

          <!-- جمع‌بندی -->
          <div class="mt-3 pt-3 border-t border-gray-200 space-y-1 text-xs text-gray-600">
            <div class="flex justify-between">
              <span>جمع کالاها</span>
              <span>{{ numberFormat(order.total_amount) }} تومان</span>
            </div>
            <div v-if="order.coupon_amount > 0" class="flex justify-between text-cosColor">
              <span>تخفیف</span>
              <span>− {{ numberFormat(order.coupon_amount) }} تومان</span>
            </div>
            <div v-if="order.shipping_amount" class="flex justify-between">
              <span>هزینه ارسال</span>
              <span>{{ numberFormat(order.shipping_amount) }} تومان</span>
            </div>
            <div class="flex justify-between font-bold text-sm text-secColor pt-1 border-t border-gray-100">
              <span>مبلغ پرداختی</span>
              <span class="text-mainColor">{{ numberFormat(order.paying_amount) }} تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <GlobalPagination :pages="data?.meta?.links"/>
</template>
