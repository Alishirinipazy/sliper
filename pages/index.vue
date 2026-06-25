<script setup lang="ts">
const { public: { apiBase } } = useRuntimeConfig()

const { data: slide }    = await useFetch(`${apiBase}/sliders`)
const { data: stories }  = await useFetch(`${apiBase}/stories`)
const { data: tabs }     = await useFetch(`${apiBase}/products/products-tabs`)

const bannerItemData = ref([
    {
        image: '/images/img_1.png',
        dis: 'دمپایی‌های زنانه', link: '/products?category=women', class: 'row-bg-temp'
    },
    {
        image: '/images/img_2.png',
        dis: 'دمپایی‌های مردانه', link: '/products?category=men', class: 'row-bg-temp'
    },
    {
        image: '/images/img_3.png',
        dis: 'مدل‌های بچگانه', link: '/products?category=kids', class: 'col-bg-temp'
    },
    {
        image: '/images/img_4.png',
        dis: 'پیشنهاد ویژه', link: '/products', class: 'col-bg-temp'
    },
    {
        image: '/images/img_5.png',
        dis: 'تازه‌واردها', link: '/products', class: 'col-bg-temp'
    }
])

// viewer استوری


useHead({ title: 'خوونه | فروشگاه دمپایی' })
</script>

<template>
  <LayoutsHeader/>

  <!-- اسلایدر اصلی -->
  <GlobalSlider :items="slide" h="lg:h-[90vh] h-[40vh]" :stories="stories"/>

  <!-- استوری‌ها -->

  <u-container>
    <HomeTab/>
    <br>
    <HomeBanner :dataBanner="bannerItemData"/>
  </u-container>

  <LayoutsFooter/>


</template>
