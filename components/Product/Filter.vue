<script setup>
const route = useRoute();
const router= useRouter()
const searchQuery = ref('');
const query = ref({});
const toast = useToast()
const {public: {apiBase}} = useRuntimeConfig();
defineProps(['menu'])
const {data: categories, pending: pendingCategories} = await useFetch(`${apiBase}/categories`);

function searchQueryHandler() {
  if (searchQuery.value){

  if (query.value.hasOwnProperty('page')) {
    delete query.value.page
  } else if (query.value.hasOwnProperty('search')) {
    delete query.value.page
  }
  query.value['search'] = searchQuery;

  router.push({
    path: '/products',
    query: query.value
  })
  }else {
    toast.add({title: 'بی زحمت کادر رو پر کنن .'})
  }
}
function categoriesHandel(idCategori) {
  if (query.value.hasOwnProperty('page')) {
    delete query.value.page
  } else if (query.value.hasOwnProperty('search')) {
    delete query.value.search
  }
  query.value['category'] = `${idCategori}`;

  router.push({
    path: '/products',
    query: query.value
  })

}

// the search handler send and res in api product (menu)


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
</script>
<template>


  <div class="space-y-1 lg:border-2 lg:border-cosColor lg:rounded-2  p-3 rounded-2xl">

    <UDivider label="دسته بندی" ui="{ label: 'text-primary-500 ' }"/>
    <ul class="m-0  my-1 ">
      <template v-if="!pendingCategories" v-for="(value,index) in categories?.data">
        <li
            class="px-4 py-1 rounded-2xl mx-1  cursor-pointer"
            :class="route?.query?.category== value?.id ?'text-mainColor':'text-secColor'"
            @click="categoriesHandel(value?.id)">{{ value?.name }}
        </li>
      </template>
      <li v-else class=" rounded-2xl mx-1  cursor-pointer">
        <USkeleton class="h-4 w-[400px]"/>
      </li>
    </ul>

    <form>
      <div>
        <UDivider label="مرتب سازی"/>
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
    <hr>
    <div class="  flex  bg-secColor text-white p-1 rounded relative py-2">
      <form @submit.prevent="searchQueryHandler">
        <input type="text" v-model="searchQuery" class=" bg-secColor  text-white "
               placeholder="چیزی که میخوای اینجا پیدا کن ...">
        <UButton type="submit" class="rounded-full  absolute left-2 top-1"
                 icon="material-symbols:search" color="yellow"/>
      </form>
    </div>
  </div>


</template>