<script setup lang="ts">
const { public: { apiBase } } = useRuntimeConfig()

const { data: slide }    = await useFetch(`${apiBase}/sliders`)
const { data: stories }  = await useFetch(`${apiBase}/stories`)
const { data: featured } = await useFetch(`${apiBase}/products/featured`, { query: { limit: 8 } })

const lists = computed(() => ({
  sale: featured.value?.data?.sale ?? [],
  bestsellers: featured.value?.data?.bestsellers ?? [],
  newest: featured.value?.data?.newest ?? [],
}))

// هر بار که کاربر دوباره وارد سایت می‌شود، منتخب‌ها جابه‌جا می‌شوند:
// یک بار تخفیف‌ها اول، بار بعد پرفروش‌ها. نوبت قبلی در کوکی می‌ماند (سازگار با SSR).
const lastMode = useCookie<string>('home_featured', { maxAge: 60 * 60 * 24 * 30, sameSite: 'lax' })
const mode = useState<'sale' | 'bestsellers'>('home-featured-mode', () => {
  const next = lastMode.value === 'sale' ? 'bestsellers' : 'sale'
  lastMode.value = next
  return next
})

// اگر لیست تخفیف خالی بود، همان پرفروش‌ها اول می‌آیند
const saleFirst = computed(() => mode.value === 'sale' && lists.value.sale.length > 0)

const trio = computed(() => {
  const main = saleFirst.value ? lists.value.sale : lists.value.bestsellers
  const rest = [...lists.value.bestsellers, ...lists.value.sale, ...lists.value.newest]
  const seen = new Set<number>()
  const out: any[] = []
  for (const p of [...main, ...rest]) {
    if (seen.has(p.id)) continue
    seen.add(p.id)
    out.push(p)
    if (out.length === 3) break
  }
  return out
})
const trioLabel = computed(() => (saleFirst.value ? 'کوپنـپاز؛ تخفیف‌های امروز' : 'پرفروش‌های اسلیپر پاز'))

const saleRow = computed(() => ({
  kicker: 'کوپنـپاز', title: 'تا ۵۰ درصد تخفیف', products: lists.value.sale, link: '/products?sort_by=sale', tone: 'sale' as const,
}))
const bestRow = computed(() => ({
  kicker: 'محبوب مشتری‌ها', title: 'پرفروش‌ترین‌ها', products: lists.value.bestsellers, link: '/products?sort_by=bestseller', tone: 'best' as const,
}))
const rows = computed(() => (saleFirst.value ? [saleRow.value, bestRow.value] : [bestRow.value, saleRow.value]))

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

  <main class="relative pb-4 lg:pt-24">
    <!-- استوری‌ها: بالا و وسط -->
    <HomeStoryBar :stories="stories?.data ?? []"/>

    <!-- اسلایدر + سه محصول منتخب؛ با اسکرول زیر برگه‌ی محتوا می‌رود -->
    <div class="relative">
      <div class="lg:sticky lg:top-20">
        <HomeHero :slides="slide?.data ?? []" :trio="trio" :trio-label="trioLabel"/>
      </div>

      <div class="sheet">
        <u-container>
          <HomeShowcaseRow v-for="row in rows" :key="row.tone" v-bind="row"/>

          <HomeTab/>
          <HomeShowcaseRow v-bind="{ kicker: 'تازه رسیده‌ها', title: 'جدیدترین محصولات', products: lists.newest, link: '/products', tone: 'new' }"/>

          <HomeBanner :dataBanner="bannerItemData"/>
        </u-container>
      </div>
    </div>
  </main>

  <LayoutsFooter/>
</template>

<style scoped>
/* برگه‌ی محتوا با لبه‌ی گرد از روی اسلایدر بالا می‌آید (افکت مایکروسافت استور) */
.sheet {
  @apply relative z-10 -mt-6 rounded-t-[2.5rem] bg-slate-200 pb-6 pt-6 shadow-[0_-18px_40px_-12px_rgba(34,40,49,.35)];
}
</style>
