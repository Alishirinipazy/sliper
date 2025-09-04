<script setup lang="ts">
const {public: {apiBase}} = useRuntimeConfig();
import type { TabsItem } from '@nuxt/ui'

const items = [{
  slot: 'account',
  label: 'Account'
}, {
  slot: 'password',
  label: 'Password'
},{
  slot: 'ali',
  label: 'Ali'
}]
const dataHotProduct = ref({
  title: 'دمپایی های داغ تابستونی',
  link: '/product?hots',
  product: [
    'https://picsum.photos/600/600?random=1',
    'https://picsum.photos/600/600?random=2',
    'https://picsum.photos/600/600?random=3',
    'https://picsum.photos/600/600?random=4',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
  ]
})
const dataHotAverg = ref({
  title: 'دمپایی های زنانه با تخفیفات بالا',
  link: '/product?hots',
  product: [
    'https://picsum.photos/600/600?random=7',
    'https://picsum.photos/600/600?random=8',
    'https://picsum.photos/600/600?random=9',
    'https://picsum.photos/600/600?random=10',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
  ]
})
const bannerItemData = ref([{
  image: 'https://www.nouraco.ir/wp-content/uploads/2024/11/%D8%A8%D9%86%D8%B1_%D9%85%D8%B2%D9%88%D9%86-%D9%86%D9%88%D8%B1%D8%A7_%DA%A9%D8%AA-%D9%85%DA%A9%D8%AA%DB%8C%D9%86_%D9%84%D8%A8%D8%A7%D8%B3-%D8%B2%D9%85%D8%B3%D8%AA%D8%A7%D9%86%DB%8C_%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE-scaled.webp',
  dis: 'کفش های زنانه',
  link: '/product?title:women',
  class: 'row-bg-temp'
}, {
  image: 'https://www.nouraco.ir/wp-content/uploads/2024/11/%D8%A8%D9%86%D8%B1_%D9%85%D8%B2%D9%88%D9%86-%D9%86%D9%88%D8%B1%D8%A7_%DA%A9%D8%AA-%D9%85%DA%A9%D8%AA%DB%8C%D9%86_%D9%84%D8%A8%D8%A7%D8%B3-%D8%B2%D9%85%D8%B3%D8%AA%D8%A7%D9%86%DB%8C_%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE-scaled.webp',
  dis: 'کیف های مدرن',
  link: '/product?title:buy',
  class: 'row-bg-temp'
},
  {
    image: 'https://www.nouraco.ir/wp-content/uploads/2024/11/%D8%A8%D9%86%D8%B1_%D9%85%D8%B2%D9%88%D9%86-%D9%86%D9%88%D8%B1%D8%A7_%DA%A9%D8%AA-%D9%85%DA%A9%D8%AA%DB%8C%D9%86_%D9%84%D8%A8%D8%A7%D8%B3-%D8%B2%D9%85%D8%B3%D8%AA%D8%A7%D9%86%DB%8C_%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE-scaled.webp',
    dis: 'مانتو های بهاره درسص',
    link: 'https://www.nouraco.ir/',
    class: 'col-bg-temp'
  }, {
    image: 'https://www.nouraco.ir/wp-content/uploads/2024/11/%D8%A8%D9%86%D8%B1_%D9%85%D8%B2%D9%88%D9%86-%D9%86%D9%88%D8%B1%D8%A7_%DA%A9%D8%AA-%D9%85%DA%A9%D8%AA%DB%8C%D9%86_%D9%84%D8%A8%D8%A7%D8%B3-%D8%B2%D9%85%D8%B3%D8%AA%D8%A7%D9%86%DB%8C_%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE-scaled.webp',
    dis: 'کیف صندل ست مهراناز',
    link: 'https://www.nouraco.ir/',
    class: 'col-bg-temp'
  }, {
    image: 'https://www.nouraco.ir/wp-content/uploads/2025/02/%D8%A8%D9%86%D8%B1_%D9%85%D9%84%DB%8C%DA%A9%D8%A7%D8%B3%D8%A8%D8%B2_%D9%85%D8%B2%D9%88%D9%86-%D9%86%D9%88%D8%B1%D8%A7_%D8%AF%D8%B3%DA%A9%D8%AA%D8%A7%D9%BE-scaled.webp',
    dis: 'دمپایی های ناز دخترونه',
    link: '/product?search=women',
    class: 'col-bg-temp'
  }])
const {data: slide, pending, pendingMenu, refresh} = await useFetch(() => `${apiBase}/slides`, {

});

useHead({
  title: 'خوونه'
})
</script>
<template>
  <LayoutsHeader/>
  <GlobalSlider :loading="pending" :items="slide" h="lg:h-[90vh] h-[40vh] "/>
  <u-container>
  <HomeTab/>
    <br>
    <HomeBanner :dataBanner="bannerItemData"/>
    <GlobalProductCard :dataProduct="dataHotAverg"/>
  </u-container>
  <LayoutsFooter/>
</template>


