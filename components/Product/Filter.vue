<script setup>
const route = useRoute();
const router = useRouter()
const searchQuery = ref('');
const query = ref({});
const toast = useToast()
const {public: {apiBase}} = useRuntimeConfig();
defineProps(['menu'])
const {data: categories, pending: pendingCategories} = await useFetch(`${apiBase}/filter-options`);
const items = [{
  label: 'دسته بندی', icon: 'i-categoury-information-circle', defaultOpen: true, slot: 'categoury'
}, {
  label: 'سایز', icon: 'i-categoury-information-circle', defaultOpen: true, slot: 'size'
}, {
  label: 'رنگ', icon: 'i-categoury-information-circle', defaultOpen: true, slot: 'color'
}]

const orderedCategories = computed(() => {
  const list = categories.value?.data?.categories ?? []
  const byParent = {}
  for (const c of list) {
    const key = c.parent_id ?? 'root'
    if (!byParent[key]) byParent[key] = []
    byParent[key].push(c)
  }
  const result = []
  function walk(parentKey, depth) {
    for (const c of byParent[parentKey] ?? []) {
      result.push({...c, depth})
      walk(c.id, depth + 1)
    }
  }
  walk('root', 0)
  return result
})

function searchQueryHandler() {
  if (searchQuery.value) {
    if (query.value.hasOwnProperty('page')) delete query.value.page
    else if (query.value.hasOwnProperty('search')) delete query.value.page
    query.value['search'] = searchQuery.value === 'اسلیپر' ? 'اسلیپر پاز' : searchQuery.value;
    router.push({ path: '/products', query: query.value })
  } else toast.add({title: 'بی زحمت کادر رو پر کنن .'})
}

function categoriesHandel(idCategori) {
  if (query.value.hasOwnProperty('page')) delete query.value.page
  else if (query.value.hasOwnProperty('search')) delete query.value.search
  query.value['category'] = `${idCategori}`;
  router.push({ path: '/products', query: query.value })
}

function handleFilter(filter) {
  if (query.value.hasOwnProperty('page')) delete query.value.page
  query.value['sort_by'] = `${filter}`;
  router.push({ path: '/products', query: query.value })
}
</script>

<template>
  <div class="filter-shell">
    <UAccordion multiple :items="items" :ui="{default: {
      openIcon: 'i-heroicons-chevron-down-20-solid', closeIcon: '', class: 'mb-1.5 w-full text-white', variant: 'soft', truncate: true
    }}">
      <template #categoury>
        <ul class="m-0 my-1">
          <template v-if="!pendingCategories" v-for="value in orderedCategories">
            <li class="filter-item" :style="{ paddingRight: `${1 + value.depth * 1.25}rem` }" :class="route?.query?.category == value?.id ? 'filter-active' : ''" @click="categoriesHandel(value?.id)">{{ value?.name }}</li>
          </template>
          <li v-else class="mx-1 cursor-pointer"><USkeleton class="h-4 w-[80%] bg-white/10"/></li>
        </ul>
      </template>

      <template #size>
        <ul class="m-0 my-1">
          <template v-if="!pendingCategories" v-for="value in categories?.data?.sizes">
            <li class="filter-item flex items-center gap-2" :class="route?.query?.size == value ? 'filter-active' : ''" @click="router.push({query:{...route.query, size:value}})">
              <UCheckbox :model-value="route?.query?.size === value" :label="value" />
            </li>
          </template>
          <li v-else class="mx-1 cursor-pointer"><USkeleton class="h-4 w-[80%] bg-white/10"/></li>
        </ul>
      </template>

      <template #color>
        <ul class="m-0 my-1">
          <template v-if="!pendingCategories" v-for="value in categories?.data?.colors">
            <li class="filter-item" :class="route?.query?.color == value?.name ? 'filter-active' : ''" @click="router.push({query:{...route.query, color:value?.name}})">
              <div class="flex justify-between items-center"><p>{{value?.name}}</p><p class="w-6 h-6 border border-white/15 rounded-lg" :style="{ backgroundColor: value?.color_code }"></p></div>
            </li>
          </template>
          <li v-else class="mx-1 cursor-pointer"><USkeleton class="h-4 w-[80%] bg-white/10"/></li>
        </ul>
      </template>
    </UAccordion>
  </div>
</template>

<style scoped>
.filter-shell {
  @apply space-y-1 p-3 rounded-2xl border border-mainColor/10 bg-[#111b20]/90 text-white shadow-[0_18px_55px_rgba(0,0,0,.18)] backdrop-blur-xl;
}
.filter-item {
  @apply px-4 py-2 rounded-xl mx-1 cursor-pointer text-white/65 transition hover:bg-mainColor/10 hover:text-mainColor;
}
.filter-active {
  @apply text-mainColor bg-mainColor/10 font-bold;
}
</style>