<script setup lang="ts">
const {public: {apiBase}} = useRuntimeConfig()

const {data: slide} = await useFetch(`${apiBase}/sliders`)
const {data: stories} = await useFetch(`${apiBase}/stories`)
const {data: tabs} = await useFetch(`${apiBase}/products/products-tabs`)
const {data: productsSale} = await useFetch(`${apiBase}/products?sort_by=sale`)
const saleProducts = ref({
  type :'sale',
  link: '/products?sort_by=sale',
  products: productsSale?.value?.data?.products
})

const bannerItemData = ref([
  {
    image: '/images/women.webp',
    dis: 'ست های خانومانه', link: '/products?category=4', class: 'row-bg-temp'
  },
  {
    image: '/images/men.webp',
    dis: 'ست های پسرونه', link: '/products?category=3', class: 'row-bg-temp'
  },
  {
    image: '/images/child.webp',
    dis: 'کالکشن های بچگونه', link: '/products?category=5', class: 'row-bg-temp'
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
  link: [{rel: 'canonical', href: 'https://slipperpaz.ir/'}],
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
            publisher: {'@id': 'https://slipperpaz.ir/#organization'},
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

  <main class="aquarium-home">
    <div class="aquarium-orb orb-a" aria-hidden="true"></div>
    <div class="aquarium-orb orb-b" aria-hidden="true"></div>
    <div class="aquarium-bubbles" aria-hidden="true">
      <span v-for="i in 14" :key="i" :style="{ '--i': i }"></span>
    </div>

    <h1 class="sr-only">اسلیپر پاز؛ خرید آنلاین دمپایی و کفش راحتی زنانه، مردانه و بچگانه</h1>

    <section class="relative z-[1]">
      <GlobalSlider :items="slide" h="lg:h-[90vh] h-[40vh]" :stories="stories"/>
    </section>

    <u-container class="relative z-[1]">
      <section class="ocean-section">
        <div class="section-glow"></div>
        <HomeTab/>
      </section>

      <GlobalProductCard :data-product="saleProducts"/>
      <HomeBanner :dataBanner="bannerItemData"/>
    </u-container>
  </main>

  <LayoutsFooter/>
</template>

<style>
.aquarium-home {
  @apply relative min-h-screen overflow-hidden;
}

.ocean-section {
  @apply relative my-5 rounded-[30px] p-1 sm:p-2;
}

.section-glow {
  @apply absolute inset-x-10 -top-10 h-24 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none;
}

.aquarium-orb {
  position: absolute;
  border-radius: 9999px;
  filter: blur(55px);
  pointer-events: none;
  opacity: .35;
}

.orb-a {
  width: 24rem;
  height: 24rem;
  top: 18rem;
  right: -12rem;
  background: rgba(49, 216, 255, .20);
}

.orb-b {
  width: 20rem;
  height: 20rem;
  top: 60rem;
  left: -10rem;
  background: rgba(15, 111, 146, .24);
}

.aquarium-bubbles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: .55;
}

.aquarium-bubbles span {
  position: absolute;
  bottom: -30px;
  right: calc((var(--i) * 7%) - 3%);
  width: calc(5px + (var(--i)%4) * 2px);
  height: calc(5px + (var(--i)%4) * 2px);
  border: 1px solid rgba(178, 244, 255, .45);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(108, 231, 255, .25);
  animation: bubbleRise calc(11s + var(--i) * .55s) linear infinite;
  animation-delay: calc(var(--i) * -1.1s);
}

@keyframes bubbleRise {
  0% {
    transform: translate3d(0, 0, 0) scale(.75);
    opacity: 0;
  }
  12% {
    opacity: .7;
  }
  55% {
    transform: translate3d(-18px, -45vh, 0) scale(1);
  }
  100% {
    transform: translate3d(22px, -110vh, 0) scale(1.15);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .aquarium-bubbles span {
    animation: none;
  }
}
.fire {
  transform-origin: 50px 90px;
  animation: fireFloat 0.8s infinite ease-in-out;
}

.fire-body {
  transform-origin: 50px 85px;
  animation: fireBody 0.55s infinite ease-in-out alternate;
}

.fire-inner {
  transform-origin: 52px 70px;
  animation: fireInner 0.35s infinite ease-in-out alternate;
}

.fire-tip {
  transform-origin: 76px 25px;
  animation: fireTip 0.45s infinite ease-in-out alternate;
}

@keyframes fireFloat {
  0% {
    transform: translateX(-1px) rotate(-1deg);
  }

  50% {
    transform: translateX(1px) rotate(1deg);
  }

  100% {
    transform: translateX(-1px) rotate(-1deg);
  }
}

@keyframes fireBody {
  0% {
    transform: scaleX(0.97) scaleY(0.98);
  }

  100% {
    transform: scaleX(1.02) scaleY(1.04);
  }
}

@keyframes fireInner {
  0% {
    transform: translate(-1px, 2px) scale(0.94);
    opacity: 0.8;
  }

  100% {
    transform: translate(1px, -1px) scale(1.03);
    opacity: 1;
  }
}

@keyframes fireTip {
  0% {
    transform: rotate(-8deg) scale(0.9);
  }

  100% {
    transform: rotate(6deg) scale(1.08);
  }
}
</style>