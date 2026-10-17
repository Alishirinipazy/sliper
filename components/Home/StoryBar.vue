<script setup lang="ts">
// استوری‌ها: یک قرص شیشه‌ای بالا و وسط صفحه (طبق طرح)
const props = defineProps<{ stories: any[] }>()

const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openStory(i: number) {
  viewerIndex.value = i
  viewerOpen.value = true
}
</script>

<template>
  <div v-if="stories?.length" class="flex justify-center px-3 pb-3 pt-2">
    <div class="no-scrollbar flex max-w-full gap-4 overflow-x-auto rounded-full bg-white/80 px-5 py-2 shadow-lg shadow-gray-400/40 backdrop-blur">
      <button v-for="(story, i) in stories" :key="story.id" type="button" class="group flex shrink-0 flex-col items-center gap-1"
              :aria-label="`مشاهده استوری ${story.title || ''}`" @click="openStory(i)">
        <span class="story-ring">
          <span class="block h-14 w-14 overflow-hidden rounded-full border-2 border-white bg-gray-100">
            <img v-if="story.type === 'image' || story.thumbnail" :src="story.type === 'image' ? story.file : story.thumbnail"
                 :alt="story.title || 'استوری'" class="h-full w-full object-cover transition group-hover:scale-110">
            <span v-else class="flex h-full w-full items-center justify-center bg-secColor">
              <UIcon name="material-symbols:play-arrow" class="h-6 w-6 text-mainColor"/>
            </span>
          </span>
        </span>
        <span class="max-w-[60px] truncate text-[10px] text-gray-600">{{ story.title || 'استوری' }}</span>
      </button>
    </div>

    <ClientOnly>
      <StoryViewer v-if="viewerOpen" :stories="stories" :start-index="viewerIndex" @close="viewerOpen = false"/>
    </ClientOnly>
  </div>
</template>

<style scoped>
.story-ring {
  @apply block rounded-full p-[2px] transition group-hover:scale-105;
  background: linear-gradient(15deg, #ffbe33, #e58b9a 55%, #222831);
}
</style>
