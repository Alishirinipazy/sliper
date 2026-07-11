<script setup lang="ts">
const containerRef = ref(null)
const props = defineProps(['items', 'h', 'loading','stories'])
const slides = ref(Array.from({length: 10}))
const swiper = useSwiper(containerRef, {
  effect: 'fade',
  loop: true,
  autoplay: {
    delay: 3000,
  },
  creativeEffect: {
    prev: {
      shadow: true,
      translate: [0, 0, -400],
    },
    next: {
      shadow: true,
      translate: [0, 0, -400],
    },
  },
})
// viewer استوری
const viewerOpen  = ref(false)
const viewerIndex = ref(0)
function openStory(i) { viewerIndex.value = i; viewerOpen.value = true }

</script>

<template>
  <div v-if="loading">
    <USkeleton class="h-[90vh]" :ui="{background:'bg-mainColor'}"/>
  </div>
  <div v-else class="relative mx-2 lg:m-0">
    <template v-if="props?.items?.data">
      <ClientOnly>
        <swiper-container ref="containerRef" :init="false">
          <swiper-slide
              v-for="(item, idx) in items?.data"
              :key="idx"
          >
            <div class="slider-body justify-center "
                 :class="h"
                 :style="{ backgroundImage: 'url(' + item.file + ')'}">
              <h4 class="slider-title">{{ item.title }}</h4>


              <nuxt-link :to="item?.link" v-if="item?.link">
                <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
              </nuxt-link>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </template>
    <div v-else class="slider-body justify-end " :class="h"
         style="direction: rtl" :style="{ backgroundImage: 'url(' + items?.image + ')'}">
      <h4 class="slider-title ">{{ items?.title }}</h4>

      <nuxt-link v-if="items?.link" :to="items?.link">
        <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
      </nuxt-link>
    </div>
    <div class="absolute  lg:block  bottom-0 z-10 w-full rounded-t-full bg-slate-200   00 h-5">
      <!-- استوری‌ها -->
      <div v-if="stories?.data?.length" class="">
        <u-container>
          <div class="flex gap-4 overflow-x-auto py-1" style="scrollbar-width:none">
            <div v-for="(story, i) in stories.data" :key="story.id"
                 @click="openStory(i)"
                 class="flex flex-col items-center gap-1 cursor-pointer flex-shrink-0 group">
              <!-- حلقه گرادیانت -->
              <div class="p-[2px] rounded-full"
                   style="background: linear-gradient(15deg, #ffbe33, #222831);">
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
      <ClientOnly>
        <StoryViewer v-if="viewerOpen"
                     :stories="stories?.data ?? []"
                     :start-index="viewerIndex"
                     @close="viewerOpen = false"/>
      </ClientOnly>
    </div>
  </div>
      <br><br><br>
</template>

<style lang="css">
.slider-body {
  @apply w-full lg:rounded  rounded-2xl lg:px-12 text-center flex flex-col align-sub  lg:bg-no-repeat bg-cover bg-center py-4 text-mainColor font-bold sm:text-right
}

.slider-title {
  @apply py-2 text-3xl lg:text-4xl font-bold
}

.slider-dis {
  @apply py-2 text-cosColor
}



</style>
