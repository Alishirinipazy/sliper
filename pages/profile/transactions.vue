<script setup>
import {numberFormat} from "~/utils/helper.js";

const route = useRoute()
const page = route.path
const {data, refresh, pending} = await useFetch(() => "/api/profile/tarnsactions", {
  query: {page},
  headers: useRequestHeaders(['cookie'])
})


const transactions = ref([])
data?.value?.transactions?.map((item) => {
  const items = {
    'شماره سفارش': item?.id,
    'مبلغ': numberFormat(item?.amount),
    'وضعیت': item?.status,
    'شماره پیگیری': item?.payment_status,
    'تاریخ': item?.trans_id,

  }

  transactions?.value?.push(items)


})







</script>
<template>

  <div class=" border-2 rounded-2xl  mx-3 my-2">
    <h5 class="font-bold px-2 mt-4 text-xl">تراکنش ها</h5>
    <div class="flex justify-between p-2 border-b"><p>در این صفحه میتونی رسید پرداخت هایی که انجام دادی رو مشاهده کنی</p>

    </div>
    <UTable  :rows="transactions" :ui="{th: {base: 'text-right', },}"/>

  </div>
  <GlobalPagination :pages="data?.meta?.links"/>
</template>