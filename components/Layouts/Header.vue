<script setup lang="ts">
const isOpen = ref(false)
const classHeader = ref('header');
onMounted(() => {
  window.onscroll = () => {
    if (document.documentElement.scrollTop <= 400) {
      classHeader.value = "header"
    } else {
      classHeader.value = "header-scroll"

    }
  }
})
const colorMode = useColorMode()
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})
</script>
<template>
  <header class="transition-all text-cyan-50 duration-700 ease-in-out z-110" :class="classHeader">
    <u-container class="">
      <div class="   flex justify-between lg:justify-around md:justify-around items-center w-full">
        <div class="w-1/3  lg:hidden  block">
          <UButton class="rounded-full mx-1" @click="isOpen = true" icon="material-symbols:menu-rounded"
                   color="yellow"/>
        </div>
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
          <div class="hidden lg:block">
            <!---->
            <ClientOnly>
              <UButton
                  :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
                  color="yellow"
                  @click="isDark = !isDark"
                  class="rounded-full mx-1"
              />
            </ClientOnly>
            <!---->
            <UButton class="rounded-full mx-1" icon="material-symbols:search" color="yellow"/>
            <!---->
            <UButton class="rounded-full mx-1" icon="mdi:cards-heart" color="yellow"/>
            <!---->
            <UButton class="rounded-full mx-1" icon="material-symbols:shopping-cart" color="yellow"/>
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
          <li class="p-2 ">
            <nuxt-link to="/" @click="isOpen = false">
              خونه
            </nuxt-link>
          </li>
          <li class="p-2 border-t-2 ">
            <nuxt-link to="/products" @click="isOpen = false">
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

            <UButton class="rounded-full mx-1" icon="material-symbols:search" color="yellow"/>
            <!---->
            <UButton class="rounded-full mx-1" icon="mdi:cards-heart" color="yellow"/>
            <!---->
            <UButton class="rounded-full  mx-1" icon="material-symbols:shopping-cart" color="yellow"/>
          </div>
        </template>
      </UCard>
    </USlideover>
  </header>
</template>
<style>
.header {
  @apply fixed top-0 w-full z-20   py-2
}
.header-scroll {
  @apply fixed top-0 w-full z-20 bg-secColor py-1
}
</style>