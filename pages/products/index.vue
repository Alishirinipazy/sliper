<script setup lang="ts">


const {public: {apiBase}} = useRuntimeConfig();
const query = ref({});
const route = useRoute();
const router = useRouter();
const {data: categories, pending: pendingCategories} = await useFetch(`${apiBase}/categories`);
const searchQuery = <ITextWriter>ref();

const {data: menu, pending: pendingMenu, refresh} = await useFetch(() => `${apiBase}/menu`, {
  query: query
});

query.value = route.query
// the handler change param from api menu
watch(route, () => {
  query.value = route.query
  refresh()
})
// -----------------------------------
const itemsSlider = {
  image: 'https://www.nouraco.ir/wp-content/uploads/2024/11/%D8%A8%D9%86%D8%B1_%D9%85%D8%B2%D9%88%D9%86-%D9%86%D9%88%D8%B1%D8%A7_%DA%A9%D8%AA-%D9%85%DA%A9%D8%AA%DB%8C%D9%86_%D9%84%D8%A8%D8%A7%D8%B3-%D8%B2%D9%85%D8%B3%D8%AA%D8%A7%D9%86%DB%8C_%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE-scaled.webp',
  title: 'محصولاتمون',
  dis: 'همه محصولات اسلیپر استور رو میتونی از اینجا با جزئیات بیشتر ببینی'
}

// the handler category send api and show result
function categoriesHandel(idCategori) {
  if (query.value.hasOwnProperty('page')) {
    delete query.value.page
  } else if (query.value.hasOwnProperty('search')){
    delete query.value.search
  }
  query.value['category'] = `${idCategori}`;

  router.push({
    path: '/products',
    query: query.value
  })

}
// the search handler send and res in api product (menu)
function searchQueryHandler(){
  if (query.value.hasOwnProperty('page')) {
    delete query.value.page
  } else if (query.value.hasOwnProperty('search')){
    delete query.value.page
  }
  query.value['search'] = searchQuery;

  router.push({
    path: '/products',
    query: query.value
  })
}
function handleFilter(filter) {
  if (query.value.hasOwnProperty('page')) {
    delete query.value.page
  }
  query.value['sortBy'] = `${filter}`;

  router.push({
    path: '/products',
    query: query.value
  })

}


useHead({
  title: 'محصولاتمون'
})

</script>
<template>
  <LayoutsHeader/>
  <GlobalSlider :items="itemsSlider" h="50vh"/>

  <UContainer>
    <div class="my-2 w-full lg:grid grid-cols-12">
      <div class="col-span-6 ">
      <ul class="m-0 flex justify-center lg:justify-start lg:m-0 my-1 ">
        <template v-if="!pendingCategories" v-for="(value,index) in categories?.data">
          <li
              class="px-4 py-1 rounded-2xl mx-1  cursor-pointer"
              :class="route?.query?.category== value?.id ?'bg-mainColor':'bg-secColor text-white'"
              @click="categoriesHandel(value?.id)">{{ value?.name }}
          </li>
        </template>
        <li v-else class=" rounded-2xl mx-1  cursor-pointer">
          <USkeleton class="h-4 w-[400px]"/>
        </li>
      </ul>
      </div>
      <div class="col-span-6   flex items-center bg-secColor text-white p-1 rounded relative">
        <form>
          <input type="text" v-model="searchQuery" class=" bg-secColor  text-white w-96" placeholder="چیزی که میخوای اینجا پیدا کن ...">
          <UButton class="rounded-full  absolute left-2 top-0" @click="searchQueryHandler" icon="material-symbols:search" color="yellow"/>
        </form>
      </div>
    </div>
    <div class="grid lg:grid-cols-12 gap-4 ">
      <div class="col-span-9 lg:col-span-3 my-2">
        <div class="space-y-1 bg-cosColor text-white p-3 rounded-2xl">
          <form>
            <div>
              <label class="form-label">مرتب سازی</label>
              <div class="form-check my-2">
                <input class="form-check-input" @click="handleFilter('max')"
                       :checked="route.query.hasOwnProperty('sortBy') && route.query.sortBy == 'max'"
                       type="radio" name="flexRadioDefault" id="flexRadioDefault1">
                <label class="form-check-label cursor-pointer" for="flexRadioDefault1">
                  بیشترین قیمت
                </label>
              </div>
              <div class="form-check my-2">
                <input class="form-check-input" @click="handleFilter( 'min' )"
                       :checked="route.query.hasOwnProperty('sortBy') && route.query.sortBy == 'min'"
                       type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                <label class="form-check-label cursor-pointer" for="flexRadioDefault2">
                  کمترین قیمت
                </label>
              </div>
              <div class="form-check my-2">
                <input class="form-check-input" @click="handleFilter( 'bestseller' )"
                       :checked="route.query.hasOwnProperty('sortBy') && route.query.sortBy == 'bestseller'"
                       type="radio" name="flexRadioDefault" id="flexRadioDefault3">
                <label class="form-check-label cursor-pointer" for="flexRadioDefault3">
                  پرفروش ترین
                </label>
              </div>
              <div class="form-check my-2">
                <input class="form-check-input" @click="handleFilter( 'sale' )"
                       :checked="route.query.hasOwnProperty('sortBy') && route.query.sortBy == 'sale'"
                       type="radio" name="flexRadioDefault" id="flexRadioDefault4">
                <label class="form-check-label cursor-pointer" for="flexRadioDefault4">
                  با تخفیف
                </label>
              </div>
            </div>
          </form>
        </div>
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

