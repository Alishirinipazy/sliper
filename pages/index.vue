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

useSeoMeta({
  title: 'اسلیپر پاز | خرید آنلاین دمپایی و کفش راحتی زنانه، مردانه و بچگانه',
  description: 'فروشگاه اینترنتی اسلیپر پاز، مرجع خرید آنلاین انواع دمپایی و کفش راحتی زنانه، مردانه و بچگانه با ارسال سریع و ضمانت اصالت کالا.',
  ogTitle: 'اسلیپر پاز | خرید آنلاین دمپایی و کفش راحتی',
  ogDescription: 'خرید آنلاین انواع دمپایی و کفش راحتی زنانه، مردانه و بچگانه با ارسال سریع.',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
useHead({
  link: [{ rel: 'canonical', href: 'https://slipperpaz.ir/' }],
})
</script>

<template>
  <LayoutsHeader/>
  <h1 class="sr-only">اسلیپر پاز | خرید آنلاین دمپایی و کفش راحتی زنانه، مردانه و بچگانه کیف کفش کتونی</h1>

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