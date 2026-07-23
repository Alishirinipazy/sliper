<script setup lang="ts">
const { public: { apiBase } } = useRuntimeConfig()

const { data: slide }    = await useFetch(`${apiBase}/sliders`)
const { data: stories }  = await useFetch(`${apiBase}/stories`)
const { data: tabs }     = await useFetch(`${apiBase}/products/products-tabs`)

const bannerItemData = ref([
    {
        image: '/images/women.webp',
        dis: 'ست های خانومانه', link: '/products?category=women', class: 'row-bg-temp'
    },
    {
        image: '/images/men.webp',
        dis: 'ست های پسرونه', link: '/products?category=men', class: 'row-bg-temp'
    },
    {
        image: '/images/child.webp',
        dis: 'کالکشن های بچگونه', link: '/products?category=kids', class: 'row-bg-temp'
    }
])

useHead({ title: 'خوونه ' })
</script>

<template>
  <LayoutsHeader/>

  <!-- اسلایدر اصلی -->
  <GlobalSlider :items="slide" h="lg:h-[90vh] h-[40vh]" :stories="stories"/>


  <u-container>
    <HomeTab/>
    <br>
    <HomeBanner :dataBanner="bannerItemData"/>
  </u-container>

  <LayoutsFooter/>

  <!-- viewer استوری -->

</template>
