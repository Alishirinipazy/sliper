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
const viewerOpen  = ref(false)
const viewerIndex = ref(0)
function openStory(i) { viewerIndex.value = i; viewerOpen.value = true }

useHead({ title: 'خوونه | فروشگاه دمپایی' })
</script>

<template>
  <LayoutsHeader/>

  <!-- اسلایدر اصلی -->
  <GlobalSlider :items="slide" h="lg:h-[90vh] h-[40vh]"/>

  <!-- استوری‌ها -->
  <div v-if="stories?.data?.length" class="bg-white border-b shadow-sm">
    <u-container>
      <div class="flex gap-4 overflow-x-auto py-4" style="scrollbar-width:none">
        <div v-for="(story, i) in stories.data" :key="story.id"
             @click="openStory(i)"
             class="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group">
          <!-- حلقه گرادیانت -->
          <div class="p-[2px] rounded-full"
               style="background: linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)">
            <div class="w-14 h-14 rounded-full border-2 border-white overflow-hidden bg-gray-100">
              <img v-if="story.type === 'image'" :src="story.file"
                   class="w-full h-full object-cover group-hover:scale-110 transition"/>
              <img v-else-if="story.thumbnail" :src="story.thumbnail"
                   class="w-full h-full object-cover group-hover:scale-110 transition"/>
              <div v-else class="w-full h-full bg-secColor flex items-center justify-center">
                <UIcon name="material-symbols:play-arrow" class="text-mainColor w-6 h-6"/>
              </div>
            </div>
          </div>
          <span class="text-[10px] text-gray-600 truncate max-w-[56px] text-center">
            {{ story.title || 'استوری' }}
          </span>
        </div>
      </div>
    </u-container>
  </div>

  <u-container>
    <HomeTab/>
    <br>
    <HomeBanner :dataBanner="bannerItemData"/>
  </u-container>

  <LayoutsFooter/>

  <!-- viewer استوری -->
  <ClientOnly>
    <StoryViewer v-if="viewerOpen"
                 :stories="stories?.data ?? []"
                 :start-index="viewerIndex"
                 @close="viewerOpen = false"/>
  </ClientOnly>
</template>
