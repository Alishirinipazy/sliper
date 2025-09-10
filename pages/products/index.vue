<script setup lang="ts">


const {public: {apiBase}} = useRuntimeConfig();
const query = ref({});
const route = useRoute();
const router = useRouter();

const searchQuery = <ITextWriter>ref();
const isOpen = ref(false)

const {data: menu, pending: pendingMenu, refresh} = await useFetch(() => `${apiBase}/menu`, {
  query: query
});


// the handler change param from api menu
watch(route, () => {
  query.value = route.query
  isOpen.value = false
  console.log(isOpen)
  refresh()
})
// -----------------------------------
const itemsSlider = {
  image: '/images/img_2.png',
  title: 'محصولاتمون',
  dis: 'همه محصولات اسلیپر استور رو میتونی از اینجا با جزئیات بیشتر ببینی'
}

const links = [{
  label: 'خوونه',
  to: '/'
}, {
  label: 'محصولاتمون',
  to:'/products'
}]



useHead({
  title: 'محصولاتمون'
})

</script>
<template>
  <LayoutsHeader/>
  <GlobalSlider :items="itemsSlider" h="50vh"/>

  <UContainer>
    <div class="flex justify-between items-center">

    <UBreadcrumb :links="links" :ui="{active:'text-mainColor',base:'font-light'}" />

    <button @click="isOpen=true" class="rounded bg-mainColor p-1 lg:hidden mx-2 mt-2">
      <span>فیلتر محصولات</span>
      <UIcon name="material-symbols:filter-alt-sharp"/>
    </button>
    </div>

    <USlideover v-model="isOpen" prevent-close>
      <UCard class="flex flex-col flex-1"
             :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              فیلتر محصولات
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                     @click="isOpen = false"/>
          </div>
        </template>
        <ProductFilter :menu="menu"/>
      </UCard>
    </USlideover>
    <div class="grid lg:grid-cols-12 gap-4 ">
      <div class="hidden lg:block lg:col-span-3 my-2">
        <ProductFilter :menu="menu"/>
      </div>
      <div v-if="menu?.data?.products?.length" class="grid col-span-9  grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        <template v-if="!pendingMenu" v-for="(item,index) in menu?.data?.products">

          <ProductIitem :product="computed(()=>item)"/>
        </template>
        <template v-else v-for="(item,index) in 8">
          <GlobalLoaderMenu/>
        </template>
      </div>
      <div v-else class="flex justify-center items-center col-span-9">
        نااازییی... محصولی که میخوایی رو پیداا نکردیم!..
      </div>
    </div>
    <GlobalPagination :pages="menu?.data?.meta?.links"/>
  </UContainer>
  <LayoutsFooter/>
</template>

