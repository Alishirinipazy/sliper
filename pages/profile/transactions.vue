<script setup>
const route = useRoute()
const page = route.path
const {data, refresh, pending} = await useFetch(() => "/api/profile/transactions", {
  query: {page},
  headers: useRequestHeaders(['cookie'])
})
const orders = ref([]);


data?.value?.orders?.map((item) => {
  const items = {
    'شماره سفارش': item?.id,
    'آدرس': item?.address_title,
    'وضعیت': item?.status,
    'وضعیت پرداخت': item?.payment_status,
    'قیمت کل': item?.paying_amount,
    'تاریخ': item?.created_at,

  }

  orders?.value?.push(items)


})



c



</script>
<template>
  <div class=" border-2 rounded-2xl  mx-3 my-2">
    <h5 class="font-bold px-2 mt-4 text-xl">تراکنش ها</h5>
    <div class="flex justify-between p-2 border-b"><p>در این صفحه میتونی رسید پرداخت هایی که انجام دادی رو مشاهده کنی</p>

    </div>
    <UTable v-model:expand="expand" :rows="orders" :ui="{th: {base: 'text-right', },}">
      <template #expand="{ row }">
        <div class="p-4">

          <template v-for="item in orders_product[row['شماره سفارش']-10 ]">
            <div class="grid col-span-9  grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {{item}}

            </div>
          </template>
        </div>
      </template>
    </UTable>
  </div>
  <GlobalPagination :pages="data?.meta?.links"/>
</template>