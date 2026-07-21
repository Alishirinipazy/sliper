<script setup>
import { numberFormat } from "~/utils/helper.js";

const route = useRoute()
const page = computed(() => Number(route.query.page) || 1)

const { data, refresh, pending } = await useFetch("/api/profile/tarnsactions", {
  query: { page },
  headers: useRequestHeaders(['cookie'])
})

const transactions = computed(() => data.value?.transactions ?? [])

function statusLabel(status) {
  return status === 1 ? 'پرداخت موفق' : 'در انتظار / ناموفق'
}
</script>
<template>

  <div class=" border-2 rounded-2xl  mx-3 my-2 ">
    <h5 class="font-bold px-2 mt-4 text-xl text-mainColor">تراکنش ها</h5>
    <div class="flex justify-between p-2 border-b ">
      <p>در این صفحه میتونی رسید پرداخت هایی که انجام دادی رو مشاهده کنی</p>
    </div>

    <div v-if="pending" class="flex justify-center py-10">
      <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-mainColor"/>
    </div>

    <div v-else-if="!transactions.length" class="text-center py-10 text-gray-400">
      تراکنشی هنوز برای شما ثبت نشده
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div v-for="item in transactions" :key="item.id" class="flex items-center justify-between p-3">
        <div class="flex flex-col gap-1">
          <span class="text-sm font-bold">سفارش #{{ item.order_id }}</span>
          <span class="text-xs text-gray-400">{{ item.created_at }}</span>
          <span v-if="item.trans_id" class="text-xs text-gray-400">کد پیگیری: {{ item.trans_id }}</span>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="font-bold text-secColor">{{ numberFormat(item.amount) }} تومان</span>
          <span class="text-xs px-2 py-0.5 rounded-full"
                :class="item.status === 1 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'">
            {{ statusLabel(item.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <GlobalPagination :pages="data?.meta?.links" />
</template>
