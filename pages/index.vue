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
  script: [
    {
      key: 'site-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://slipperpaz.ir/#organization',
            name: 'اسلیپر پاز',
            alternateName: 'Slipper Paz',
            url: 'https://slipperpaz.ir/'
          },
          {
            '@type': 'WebSite',
            '@id': 'https://slipperpaz.ir/#website',
            url: 'https://slipperpaz.ir/',
            name: 'اسلیپر پاز',
            publisher: { '@id': 'https://slipperpaz.ir/#organization' },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://slipperpaz.ir/products?search={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          }
        ]
      })
    }
  ]
})
</script>

<template>
  <LayoutsHeader/>
  <h1 class="sr-only">اسلیپر پاز؛ خرید آنلاین دمپایی و کفش راحتی زنانه، مردانه و بچگانه</h1>

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