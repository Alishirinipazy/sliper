<script setup lang="ts">
const isOpen = ref(false)
</script>
<template>
  <header class="fixed top-0 w-full">
    <u-container class="py-3">
      <div class=" flex justify-between lg:justify-around md:justify-around items-center w-full">
        <div class="w-1/3  lg:hidden md:hidden block">
          <UButton class="rounded-full mx-1" @click="isOpen = true" icon="material-symbols:menu-rounded"
                   color="yellow"/>
        </div>
        <div class="hidden md:flex lg:flex w-1/3  justify-center">
          <ul class="flex ">
            <li class="px-2">
              <nuxt-link to="/">
                خونه
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/product">
                محصولاتمون
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/about">
                دربارمون
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/contact">
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
          <div class="hidden lg:block">
            <!---->
            <UButton class="rounded-full mx-1" icon="material-symbols:search-rounded" color="yellow"/>
            <!---->
            <UButton class="rounded-full mx-1" icon="mdi:cards-heart" color="yellow"/>
            <!---->
            <UButton class="rounded-full mx-1" icon="material-symbols:shopping-cart-rounded" color="yellow"/>
          </div>
          <UButton color="yellow" class="mx-2" :ui="{ rounded: 'rounded-full' }">
            <span class="hidden md:block">ثبت نام | ورود</span>
            <UIcon name="octicon:sign-in-16" class="w-5 h-5"/>
          </UButton>
        </div>
      </div>
    </u-container>
    <!------------------the mobile menu slide over------------------->
    <USlideover v-model="isOpen">
      <UCard
          class="flex flex-col flex-1"
          :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
      >
        <template #header>
          <UButton
              color="gray"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark-20-solid"
              class="flex sm:hidden absolute end-5 top-5 z-10"
              square
              padded
              @click="isOpen = false"
          />

          منو
        </template>

        <Placeholder class="h-full"/>
        <ul class="">
          <li class="p-2  ">
            <nuxt-link to="/" @click="isOpen = false">
              خونه
            </nuxt-link>
          </li>
          <li class="p-2 border-t-2 ">
            <nuxt-link to="/product" @click="isOpen = false">
              محصولاتمون
            </nuxt-link>
          </li>
          <li class="p-2 border-t-2 ">
            <nuxt-link to="/about" @click="isOpen = false">
              دربارمون
            </nuxt-link>
          </li>
          <li class="p-2 border-t-2 ">
            <nuxt-link to="/contact" @click="isOpen = false">
              تماس با ما
            </nuxt-link>
          </li>
        </ul>
        <template #footer>
          <div class="text-center">

            <UButton class="rounded-full mx-1" icon="material-symbols:search-rounded" color="yellow"/>
            <!---->
            <UButton class="rounded-full mx-1" icon="mdi:cards-heart" color="yellow"/>
            <!---->
            <UButton class="rounded-full mx-1" icon="material-symbols:shopping-cart-rounded" color="yellow"/>
          </div>
        </template>
      </UCard>
    </USlideover>
  </header>
</template>
