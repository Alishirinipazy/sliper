<script setup lang="ts">
import {useModalStore} from '@/stores/cart'


const store = useModalStore()

const isOpen = ref(false)
const classHeader = ref('header');
const {authUser} = useAuth();
const props = defineProps(['fixed'])
if (props?.fixed) {
  classHeader.value = "header-block"
} else {
  classHeader.value = "header"
  onMounted(() => {
    window.onscroll = () => {
      if (document.documentElement.scrollTop <= 200) {
        classHeader.value = "header"
      } else {
        classHeader.value = "header-scroll"

      }
    }
  })
}

</script>
<template>
  <header class="transition-all text-cyan-50 duration-700 ease-in-out z-110" :class="classHeader">
    <u-container>
      <div class="flex justify-between lg:justify-around md:justify-around items-center w-full">

        <div class="hidden  lg:flex w-1/3  justify-center">
          <ul class="flex ">
            <li class="px-2" :class="{'text-amber-400': $route.path==='/'}">
              <nuxt-link to="/">
                خونه
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/products" :class="{'text-amber-400': $route.path==='/products'}">
                محصولاتمون
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/about" :class="{'text-amber-400': $route.path==='/about'}">
                دربارمون
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/contact" :class="{'text-amber-400': $route.path==='/contact'}">
                تماس با ما
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="w-1/3 flex justify-center">
          <nuxt-link to="/">
            <img src="/images/logo.png" class="w-[130px]" alt="">
          </nuxt-link>
        </div>
        <div class=" w-1/3 flex justify-end mx-1">
          <!---->

          <div class="hidden lg:block">
            <!---->
            <!---->
            <UButton class="rounded-full mx-1" icon="mdi:cards-heart" color="yellow"/>
            <!---->
            <UChip :text="0" c size="lg" :ui="{variants:{color:'bg-mainColor'}}">
            <UButton class="rounded-full mx-1" icon="material-symbols:shopping-cart" @click="store?.changeStatusModal()"
                     color="yellow"/>
            </UChip>
          </div>
          <UButton class="rounded-full mx-1" icon="material-symbols:search" color="yellow"/>
          <nuxt-link to="/auth/login" v-if="!authUser">
            <UButton color="yellow" class="mx-2" :ui="{ rounded: 'rounded-full' }">
              <span class="hidden md:block">ثبت نام | ورود</span>
              <UIcon name="octicon:sign-in-16" class="w-5 h-5"/>
            </UButton>
          </nuxt-link>
          <nuxt-link to="/profile/" v-else :class="{'text-amber-400': $route.path.includes('profile')}">
            <UButton color="yellow" class="mx-2" :class="{'bg-cosColor': $route.path.includes('profile')  }"
                     :ui="{ rounded: 'rounded-full' }">
              <span class="hidden md:block">{{ authUser?.name }}</span>
              <UIcon name="material-symbols:account-circle" class="w-5 h-5"/>
            </UButton>
          </nuxt-link>
        </div>
      </div>
    </u-container>
    <!------------------the mobile menu slide over------------------->
    <div class="fixed lg:hidden bottom-0 flex justify-center w-screen z-20 bg-secColor"
         :class="{'hidden': $route.path.includes('profile')}">


      <div class="   flex  text-center">
        <nuxt-link to="/" class="header-item" :class="{'text-amber-400': $route.path==='/'}">
          <UIcon name="material-symbols:other-houses" class="w-5 h-5"/>
          <p>خوونه</p>
        </nuxt-link>
        <nuxt-link to="/products" class="header-item" :class="{'text-amber-400': $route.path==='/products'}">
          <UIcon name="bxs:category" class="w-5 h-5"/>
          <p>محصولاتمون</p></nuxt-link>
        <nuxt-link to="/cart" class="header-item" :class="{'text-amber-400': $route.path==='/Cart'}">
          <UIcon name="icon-park-solid:buy" class="w-5 h-5"/>
          <p>سبدخرید</p></nuxt-link>

        <nuxt-link to="/auth/login" class="header-item" v-if="!authUser">

          <UIcon name="octicon:sign-in-16" class="w-5 h-5"/>
          <p> ورود</p>

        </nuxt-link>
        <nuxt-link to="/profile/" v-else class="header-item"
                   :class="{'text-amber-400': $route.path.includes('profile')}">
          <UIcon name="material-symbols:account-circle" class="w-5 h-5"/>
          <p>{{ authUser?.name }}</p>

        </nuxt-link>
      </div>
    </div>
  </header>
  <USlideover v-model="store.isOpenModal" class="flex flex-col flex-1"
              :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <ProductCart/>
  </USlideover>
</template>
<style>
.header {
  @apply lg:fixed top-0 w-full z-20   py-2
}

.header-scroll {
  @apply lg:fixed top-0 w-full z-20 bg-secColor py-1
}

.header-item {
  @apply flex flex-1 items-center flex-col px-5 py-2
}

.header-item p {
  @apply text-xs
}

.header-block {
  @apply block bg-secColor py-2
}
</style>