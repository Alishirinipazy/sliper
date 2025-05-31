<script setup lang="ts">

import type {AccordionItem} from '@nuxt/ui';
import type {CheckboxGroupItem, CheckboxGroupValue} from '@nuxt/ui'

const itemsCheck = ref<CheckboxGroupItem[]>(['System', 'Light', 'Dark'])
const value = ref<CheckboxGroupValue[]>(['System'])
const {public: {apiBase}} = useRuntimeConfig();
const {data: categories,pending:pendingCategories} = await useFetch(`${apiBase}/categories`);
const {data:menu,pending:pendingMenu} = await useFetch(`${apiBase}/menu`);

const itemsSlider = {
  image: 'https://www.nouraco.ir/wp-content/uploads/2024/11/%D8%A8%D9%86%D8%B1_%D8%AC%D9%84%DB%8C%D9%82%D9%87-%D8%AF%D8%A7%D9%85%D9%86-%D8%B4%D8%A7%DB%8C%D8%B3%D8%AA%D9%87_%D9%85%D8%B2%D9%88%D9%86-%D9%86%D9%88%D8%B1%D8%A7_%D9%84%D8%A8%D8%A7%D8%B3-%D8%B3%D8%AA_%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE-scaled.webp',
  title: 'محصولاتمون',
  dis: 'همه محصولات اسلیپر استور رو میتونی از اینجا با جزئیات بیشتر ببینی'
}
const products = [
  'https://picsum.photos/600/600?random=1',
  'https://picsum.photos/600/600?random=2',
  'https://picsum.photos/600/600?random=3',
  'https://picsum.photos/600/600?random=4',
  'https://picsum.photos/600/600?random=5',
  'https://picsum.photos/600/600?random=6'
]
const people = ['زنونه', 'بچگونه', 'مردونه']
const items: AccordionItem[] = [
  {
    label: 'دسته بندی',
    slot: 'categories'
  },
  {
    label: 'Colors',
    icon: 'i-lucide-swatch-book',
    slot: 'colors'
  },
  {
    label: 'Components',
    icon: 'i-lucide-box'
  }
]
const selected = ref(people[0])

useHead({
  title: 'محصولاتمون'
})
</script>
<template>
  <GlobalSlider :items="itemsSlider" h="50vh"/>

  <UContainer>
    <div class="my-2">
      <ul class="m-0 flex">
        <template  v-if="!pendingCategories" v-for="(value,index) in categories?.data">
          <li style="background: rgba(121,121,121,0.32)"
              class="px-4 py-1 rounded-2xl mx-1  cursor-pointer" @click="value">{{ value.name }}
          </li>
        </template>
          <li v-else  class=" rounded-2xl mx-1  cursor-pointer">
            <USkeleton class="h-4 w-[400px]"/>
          </li>
      </ul>
    </div>
    <div class="grid lg:grid-cols-12 gap-4 ">
      <div class="col-span-9 lg:col-span-3 my-2">
        <UAccordion :items="items">
          <template #categories>
            <ul class="m-0">
              <template v-for="(value,index) in categories?.data">
                <li class="m-1 cursor-pointer" @click="value">{{ value.name }}</li>
              </template>
            </ul>
          </template>
        </UAccordion>
      </div>
      <div class="grid col-span-9  grid-cols-2 lg:grid-cols-4 gap-2">
        <template v-if="!pendingMenu" v-for="(item,index) in menu?.data?.products">
          <ProductIitem :product="item"/>
        </template>
        <template v-else v-for="(item,index) in 8">
          <GlobalLoaderMenu />
        </template>
      </div>
    </div>
  </UContainer>
</template>

