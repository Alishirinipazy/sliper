<script setup lang="ts">
import {useModalStore} from "~/stores/cart";

const {authUser} = useAuth()
const toast = useToast()
const store = useModalStore()
const addressId = ref(null)
const allCard = computed(() => store?.allItem)

function removeFromCard(id) {
  store.remove(id.id)
  toast.add({title: `${id.name} با موفقیت پاک شد`})

}


const totalAmount = computed(() => store.totalAmount)
const copun = reactive({
  code: '',
  percent: 0
})
</script>

<template>
  <ClientOnly>
    <UCard
        class="flex flex-col flex-1"
        :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            سبد خرید
            <p v-if="store?.card?.length" class="text-sm font-light text-mainColor">{{ store?.card?.length }} مرسوله</p>

          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                   @click="store?.changeStatusModal()"/>
        </div>
      </template>


      <div class="flex justify-center m-3 text-sm">

        <ul v-if="store?.card?.length" class="h-[18rem] w-screen overflow-y-scroll overscroll-none snap-none">

          <li class="bg-secColor/20 fade-in-iamge flex justify-between rounded my-1 w-11/12"
              v-for="item in store?.allItem"
              :key="item.id">


            <img src="/images/preloader.png" width="120" height="120"
                 class="rounded-r" v-img="item.primary_image" :alt="item.name"/>
            <div class="px-1 py-1 flex flex-col justify-between">
              <h5 class="font-extrabold ">{{ item.name }}
              </h5>
              <div class="flex">
                <p class="rounded-2xl text-center  w-5 h-5 text-amber-50 bg-gray-500 ">
                  10
                </p>
                <p class="w-5 mx-1 h-5 rounded-full bg-red-500 "></p>
              </div>
              <span v-if="item.is_sale">
                                                            {{ numberFormat(item.sale_price) }}
                                                        </span>
              <span v-else>
                                                            {{ numberFormat(item.price) }}
                                                            تومان
                                                        </span>
              <div class="text-red-600" v-if="item.is_sale">
                {{ salePercent(item.price, item.sale_price) }} %
              </div>
            </div>
            <div class=" flex flex-col-reverse justify-around items-end w-100">
              <div>


                <div class="flex border-gray-400 rounded-full justify-center text-xl">
                                                        <span class=" cursor-pointer"
                                                              @click="() => item.quantity > item.qty && store?.increment(item.id)">
                                                            +
                                                        </span>
                  <div class="bg-mainColor text-secColor p-1 mx-1 text-sm rounded-full">{{ item.qty }}</div>
                  <span class="minus-btn cursor-pointer"
                        @click="() => item.qty > 1 && store?.dicrement(item.id)">
-
                                                        </span>
                </div>

                <div class="px-3">
                      <span v-if="item.is_sale" class="bg-cosColor text-white rounded">
                                                        {{ numberFormat(item.sale_price * item.qty) }} تومان

                                                    </span>
                  <span v-else>
                                                        {{ numberFormat(item.price * item.qty) }} تومان

                                                    </span>
                </div>
              </div>
              <div class=" ">

                <UButton color="gray" size="xs" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                         @click="removeFromCard(item)"/>
              </div>
            </div>
          </li>


        </ul>
        <div v-else class="flex-col flex justify-center items-center">
          <img src="https://www.digikala.com/statics/img/svg/empty-cart.svg" alt="">
          <p> سبد خریدت خالیه عزیزم</p>
        </div>
      </div>


      <template #footer>

        <nuxt-link v-if="!authUser && store?.card?.length" to="/auth/login">
          <u-button color="yellow" block>
            بریم مرحله بعدی
          </u-button>
        </nuxt-link>

        <div class="grid grid-cols-12" v-else v-if="store?.card?.length">
          <div class="col-span-7 mt-2 flex">
            <h5 class=" font-extrabold flex-none py-2">مجموع سبد خرید</h5>
          </div>


          <div class=" col-span-8  ">
            <CartCoupon :coupon="copun"/>
            <ul class="bg-secColor rounded-2xl text-white price_list">
              <li class="">
                <div>مجموع قیمت :</div>
                <div>
                  {{ numberFormat(totalAmount) }}تومان
                </div>
              </li>
              <UDivider size="sm"/>
              <li class="">
                <div>تخفیف :
                  <span class="bg-cosColor  p-1 ">{{ copun.percent }}%</span>

                </div>
                <div class="text-danger">
                  {{ numberFormat((totalAmount * copun.percent) / 100) }}تومان
                </div>
              </li>
              <UDivider size="sm"/>
              <li class="">
                <div>قیمت پرداختی :</div>
                <div>
                  {{ numberFormat(totalAmount - ((totalAmount * copun.percent) / 100)) }}تومان
                </div>
              </li>
            </ul>
          </div>

          <div class="col-span-4 flex flex-col justify-end text-center px-1">
            <CartAddress @set-address-id="(id)=>addressId = id"/>
            <div class="grow h-full">
              <CartPayment :coupon="copun" :addressId="addressId" :cart="allCard"/>
            </div>
          </div>
        </div>
      </template>
    </UCard>
  </ClientOnly>
</template>

<style scoped>
.price_list li {
  @apply flex p-1 justify-between
}
</style>