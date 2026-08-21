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
  refresh()
})
// -----------------------------------
const itemsSlider = computed(() => ({
  image: '/images/img_2.png',
  title: selectedCategoryName.value || 'محصولاتمون',
  dis: selectedCategoryName.value
      ? `مشاهده و خرید آنلاین ${selectedCategoryName.value} از اسلیپر پاز`
      : 'همه محصولات اسلیپر پاز رو میتونی از اینجا با جزئیات بیشتر ببینی'
}))

const links = [{
  label: 'خوونه',
  to: '/'
}, {
  label: 'محصولاتمون',
  to: '/products'
}]


const {data: categoriesList} = await useFetch(`${apiBase}/categories`)
const selectedCategoryName = computed(() => {
  const id = Number(route.query.category)
  return categoriesList.value?.data?.find(c => c.id === id)?.name
})
const hasOnlyCategory = computed(() => {
  const keys = Object.keys(route.query)
  return keys.length === 1 && keys[0] === 'category'
})

const pageTitle = computed(() =>
    selectedCategoryName.value
        ? `${selectedCategoryName.value} | خرید آنلاین | اسلیپر پاز`
        : 'محصولات | خرید دمپایی و کفش راحتی | اسلیپر پاز'
)

const pageDescription = computed(() =>
    selectedCategoryName.value
        ? `خرید آنلاین ${selectedCategoryName.value} از اسلیپر پاز؛ مشاهده قیمت، تصاویر و مشخصات محصولات و سفارش آنلاین.`
        : 'مشاهده و خرید آنلاین دمپایی و کفش راحتی زنانه، مردانه و بچگانه از اسلیپر پاز.'
)

const productsCanonical = computed(() => {
  if (hasOnlyCategory.value && route.query.category) {
    return `https://slipperpaz.ir/products?category=${encodeURIComponent(String(route.query.category))}`
  }
  return 'https://slipperpaz.ir/products'
})


useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  robots: () => hasOnlyCategory.value || Object.keys(route.query).length === 0
      ? 'index, follow'
      : 'noindex, follow'
})

function handleFilter(filter) {
  if (query.value.hasOwnProperty('page')) {
    delete query.value.page
  }
  query.value['sort_by'] = `${filter}`;

  router.push({
    path: '/products',
    query: query.value
  })

}

useHead({
  link: [{rel: 'canonical', href: productsCanonical}]
})
const people = [{
  id: 'benjamincanac',
  label: 'بیشترین قیمت',
  to:'max'
}, {
  id: 'benjamincanac',
  label: 'کمترین قیمت',
  to:'min'
}, {
  id: 'bestseller',
  label: 'پرفروش ترین',
  to:'bestseller'
}, {
  id: 'sale',
  label: 'کوپنـ.پاز',
  to: 'sale'
}]
const selected = ref(people[0])
</script>
<template>
  <LayoutsHeader/>
  <h1 class="sr-only">{{ pageTitle }}</h1>
  <GlobalSlider :items="itemsSlider" h="lg:h-[45vh] h-[25vh]"/>
  <div class="">
    <UContainer>
        <UBreadcrumb dir="rtl" :links="links" :ui="{ active: 'text-mainColor', base: 'font-light' }"/>
      <div class="flex justify-between items-center py-3">
        <USelectMenu v-model="selected" :options="people" color="yellow" class="md:hidden">

          <template #option="{ option }">
            <p class="flex items-center" @click="handleFilter( option?.to )">
            <span v-if="option.id =='sale'" aria-hidden="true" ><svg
                width="25"

                height="25"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                  <linearGradient id="fireGradient" x1="20%" y1="0%" x2="80%" y2="100%">
                    <stop offset="0%" stop-color="#FF9AB0"/>
                    <stop offset="55%" stop-color="#F85C87"/>
                    <stop offset="100%" stop-color="#ED3970"/>
                  </linearGradient>

                  <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="blur"/>
                    <feMerge>
                      <feMergeNode in="blur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <g class="fire">
                  <path
                      class="fire-body"
                      fill="url(#fireGradient)"
                      filter="url(#fireGlow)"
                      d="M51.8 97
          C27.5 97 10 80.8 10 57.4
          C10 40.8 19.2 28.8 31.2 20
          C28.8 32.2 33.5 39.5 39.8 43
          C38.5 28.5 45.8 16.2 58.5 4
          C58.2 15.5 64.8 21.2 68.8 27
          C72.2 21.8 78.5 19.2 82 10
          C86.8 22.5 89.5 31.2 87.5 41
          C85.8 49.2 91 55.2 91 63.5
          C91 82.2 74.5 97 51.8 97Z"
                  />

                  <path
                      class="fire-inner"
                      fill="#fff"
                      d="M51.5 85
          C40.8 85 33.5 77.8 33.5 68
          C33.5 61.2 37.2 56.2 42.2 52.2
          C41.8 59.2 45.5 62.5 49 63.8
          C48.2 56.5 52 49.8 57.8 44.5
          C57.8 51.2 62.2 54.8 64.5 59
          C66.5 55.8 69.8 53.8 71.2 49.5
          C73.5 55.5 75 60 74.5 64.5
          C74 76.5 64.2 85 51.5 85Z"
                  />

                  <path
                      class="fire-tip"
                      fill="#F85C87"
                      d="M69 27
          C70 20 74 14 81 8
          C80 15 84 20 82 26
          C80 30 75 31 69 27Z"
                  />
                </g>
              </svg></span>
            <span class="truncate">{{ option.label }}</span>
            </p>
          </template>
        </USelectMenu>

        <button @click="isOpen = true" class="rounded text-sm bg-mainColor p-1 lg:hidden mx-2 ">
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

      <div class="grid lg:grid-cols-12 gap-4 items-start">
        <!-- بخش فیلتر -->
        <div class="hidden lg:block lg:col-span-3 my-2">
          <ProductFilter :menu="menu"/>
        </div>

        <!-- بخش محصولات -->
        <div
            v-if="menu?.data?.products?.length"
            class="col-span-12 lg:col-span-9">
          <div class="p-2 hidden md:block">
            <ul class="flex items-center">
              <li @click="handleFilter('max')" class="filter-class" :class="route.query.sort_by == 'max' ?'text-mainColor font-bold':'text-secColor/70'"> بیشترین قیمت</li>
              <li @click="handleFilter('min')" class="filter-class" :class="route.query.sort_by == 'min' ?'text-mainColor font-bold':'text-secColor/70'"> کمترین قیمت</li>
              <li @click="handleFilter('bestseller')" class="filter-class" :class="route.query.sort_by == 'bestseller' ?'text-mainColor font-bold':'text-secColor/70'"> پرفروش ترین</li>
              <li @click="handleFilter('sale')" class="filter-class flex items-center " :class="route.query.sort_by == 'sale' ?'text-cosColor font-bold':'text-cosColor/70'">
                <i class="    ">
                  <svg
                      width="30"
                      height="30"
                      viewBox="0 0 100 100"
                      xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id="fireGradient" x1="20%" y1="0%" x2="80%" y2="100%">
                        <stop offset="0%" stop-color="#FF9AB0"/>
                        <stop offset="55%" stop-color="#F85C87"/>
                        <stop offset="100%" stop-color="#ED3970"/>
                      </linearGradient>

                      <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2.5" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    <g class="fire">
                      <path
                          class="fire-body"
                          fill="url(#fireGradient)"
                          filter="url(#fireGlow)"
                          d="M51.8 97
          C27.5 97 10 80.8 10 57.4
          C10 40.8 19.2 28.8 31.2 20
          C28.8 32.2 33.5 39.5 39.8 43
          C38.5 28.5 45.8 16.2 58.5 4
          C58.2 15.5 64.8 21.2 68.8 27
          C72.2 21.8 78.5 19.2 82 10
          C86.8 22.5 89.5 31.2 87.5 41
          C85.8 49.2 91 55.2 91 63.5
          C91 82.2 74.5 97 51.8 97Z"
                      />

                      <path
                          class="fire-inner"
                          fill="#fff"
                          d="M51.5 85
          C40.8 85 33.5 77.8 33.5 68
          C33.5 61.2 37.2 56.2 42.2 52.2
          C41.8 59.2 45.5 62.5 49 63.8
          C48.2 56.5 52 49.8 57.8 44.5
          C57.8 51.2 62.2 54.8 64.5 59
          C66.5 55.8 69.8 53.8 71.2 49.5
          C73.5 55.5 75 60 74.5 64.5
          C74 76.5 64.2 85 51.5 85Z"
                      />

                      <path
                          class="fire-tip"
                          fill="#F85C87"
                          d="M69 27
          C70 20 74 14 81 8
          C80 15 84 20 82 26
          C80 30 75 31 69 27Z"
                      />
                    </g>
                  </svg>
                </i>کوپنـ.پاز</li>
            </ul>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            <!-- حالت نمایش محصولات -->
            <template v-if="!pendingMenu">
              <ProductIitem
                  v-for="item in menu.data.products"
                  :key="item.id"
                  :product="item"
              />
            </template>
            <!-- حالت لودینگ -->
            <template v-else>
              <GlobalLoaderMenu v-for="n in 8" :key="n"/>
            </template>
          </div>
        </div>

      </div>
      <GlobalPagination :pages="menu?.data?.meta?.links"/>
    </UContainer>
  </div>
  <LayoutsFooter/>
</template>
<style scoped>
.filter-class {
  @apply rounded-2xl mx-1 cursor-pointer decoration-dotted py-1 px-2  text-sm
}
</style>