<script setup lang="ts">
const containerRef = ref(null)
const props = defineProps(['items', 'h', 'loading', 'stories'])
const swiper = useSwiper(containerRef, {
  effect: 'fade', loop: true, autoplay: { delay: 4000 },
  creativeEffect: { prev: { shadow: true, translate: [0, 0, -400] }, next: { shadow: true, translate: [0, 0, -400] } },
})
const viewerOpen = ref(false)
const viewerIndex = ref(0)
function openStory(i) { viewerIndex.value = i; viewerOpen.value = true }
</script>

<template>
  <div v-if="loading"><USkeleton class="h-[70vh]" :ui="{background:'bg-slate-900'}"/></div>
  <div v-else class="relative px-2 lg:px-3 pt-2">
    <template v-if="props?.items?.data">
      <ClientOnly>
        <swiper-container ref="containerRef" :init="false">
          <swiper-slide v-for="(item, idx) in items?.data" :key="idx">
            <div class="slider-body aqua-surface" :class="h" :style="{ backgroundImage: `linear-gradient(90deg, rgba(2,18,28,.82), rgba(3,35,49,.22) 58%, rgba(3,18,27,.58)), url(${item.file})` }">
              <div class="underwater-grid" aria-hidden="true"></div>
              <div class="slider-copy">
                <span class="eyebrow">کالکشن جدید اسلیپر پاز</span>
                <h4 class="slider-title">{{ item.title }}</h4>
                <p class="slider-subtitle">انتخاب راحت‌تر، تجربه‌ای سبک‌تر؛ مدل مناسب خودت رو از اعماق کالکشن‌ها پیدا کن.</p>
                <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <nuxt-link :to="item?.link" v-if="item?.link"><button class="slider-cta">همین الان بخرش <UIcon name="material-symbols:arrow-back-rounded"/></button></nuxt-link>
                  <nuxt-link to="/products"><button class="slider-ghost">مشاهده محصولات</button></nuxt-link>
                </div>
              </div>
              <div class="water-light light-one"></div><div class="water-light light-two"></div>
              <div class="surface-shimmer"></div>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </template>
    <div v-else class="slider-body aqua-surface" :class="h" :style="{ backgroundImage: `linear-gradient(90deg, rgba(2,18,28,.82), rgba(3,35,49,.22) 58%, rgba(3,18,27,.58)), url(${items?.image})` }">
      <div class="underwater-grid" aria-hidden="true"></div>
      <div class="slider-copy">
        <span class="eyebrow">کالکشن جدید اسلیپر پاز</span>
        <h4 class="slider-title">{{ items?.title }}</h4>
        <p class="slider-subtitle">انتخاب راحت‌تر، تجربه‌ای سبک‌تر؛ مدل مناسب خودت رو از اعماق کالکشن‌ها پیدا کن.</p>
        <nuxt-link v-if="items?.link" :to="items?.link"><button class="slider-cta">همین الان بخرش <UIcon name="material-symbols:arrow-back-rounded"/></button></nuxt-link>
      </div>
      <div class="water-light light-one"></div><div class="water-light light-two"></div>
      <div class="surface-shimmer"></div>
    </div>

    <div class="story-dock aqua-glass">
      <div v-if="stories?.data?.length" class="overflow-x-auto" style="scrollbar-width:none">
        <div class="flex gap-4 px-3 py-2 min-w-max">
          <div v-for="(story, i) in stories.data" :key="story.id" @click="openStory(i)" class="flex flex-col items-center gap-1 cursor-pointer group w-16">
            <div class="story-ring"><div class="w-12 h-12 rounded-full border border-cyan-100/20 overflow-hidden bg-slate-900/70">
              <img v-if="story.type === 'image'" :src="story.file" :alt="story.title || 'استوری'" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
              <img v-else-if="story.thumbnail" :src="story.thumbnail" :alt="story.title || 'استوری'" class="w-full h-full object-cover group-hover:scale-110 transition duration-500"/>
              <div v-else class="w-full h-full flex items-center justify-center text-cyan-200"><UIcon name="material-symbols:play-arrow" class="w-6 h-6"/></div>
            </div></div>
            <span class="text-[10px] text-cyan-50/65 truncate max-w-16 text-center">{{ story.title || 'استوری' }}</span>
          </div>
        </div>
      </div>
      <ClientOnly><StoryViewer v-if="viewerOpen" :stories="stories?.data ?? []" :start-index="viewerIndex" @close="viewerOpen = false"/></ClientOnly>
    </div>
  </div>
</template>

<style>
.slider-body { @apply relative overflow-hidden w-full rounded-[28px] lg:rounded-[36px] bg-cover bg-center flex items-center text-white px-7 sm:px-12 lg:px-20 py-16; min-height: min(72vh, 760px); box-shadow: 0 30px 90px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.14); }
.slider-copy { @apply relative z-10 max-w-2xl text-center sm:text-right; }
.eyebrow { @apply inline-flex items-center rounded-full px-4 py-2 mb-4 text-xs sm:text-sm text-cyan-100 bg-white/10 border border-white/15 backdrop-blur-md; }
.slider-title { @apply py-2 text-3xl sm:text-4xl lg:text-6xl leading-tight font-black tracking-tight; text-shadow: 0 8px 30px rgba(0,0,0,.35); }
.slider-subtitle { @apply max-w-xl mb-6 text-sm sm:text-base leading-7 text-cyan-50/70; }
.slider-cta { @apply inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-cyan-300 to-sky-400 text-slate-950 font-bold shadow-[0_0_30px_rgba(49,216,255,.25)] transition hover:-translate-y-1 hover:shadow-[0_0_38px_rgba(49,216,255,.38)]; }
.slider-ghost { @apply inline-flex rounded-full px-6 py-3 bg-white/10 border border-white/15 text-white font-semibold backdrop-blur-md transition hover:bg-white/15; }
.story-dock { @apply absolute bottom-3 left-1/2 -translate-x-1/2 z-10 w-[calc(100%-1.5rem)] max-w-4xl rounded-[22px] overflow-hidden; }
.story-ring { @apply rounded-full p-[2px]; background: linear-gradient(135deg, #6ce7ff, #117aa0 45%, rgba(255,255,255,.3)); }
.water-light { position:absolute; width:24rem; height:24rem; border-radius:50%; filter:blur(70px); background:rgba(49,216,255,.12); pointer-events:none; animation: waterDrift 8s ease-in-out infinite alternate; }
.light-one { top:-8rem; left:-6rem; }.light-two { bottom:-12rem; right:10%; animation-delay:-3s; }
.underwater-grid { position:absolute; inset:0; pointer-events:none; opacity:.14; background: repeating-linear-gradient(105deg, transparent 0 46px, rgba(142,239,255,.18) 48px 49px, transparent 51px 92px); mask-image: linear-gradient(to bottom, rgba(0,0,0,.7), transparent 75%); animation: caustics 11s ease-in-out infinite alternate; }
.surface-shimmer { position:absolute; top:-15%; left:-10%; width:60%; height:130%; pointer-events:none; background:linear-gradient(90deg, transparent, rgba(177,246,255,.10), transparent); transform:rotate(12deg); filter:blur(12px); animation: shimmer 10s ease-in-out infinite; }
@keyframes waterDrift { from { transform:translate3d(-3%,0,0) scale(.9); opacity:.45 } to { transform:translate3d(8%,8%,0) scale(1.15); opacity:.8 } }
@keyframes caustics { from { transform:translateX(-2%) scale(1); } to { transform:translateX(3%) scale(1.05); } }
@keyframes shimmer { 0%, 35% { transform:translateX(-120%) rotate(12deg); } 70%, 100% { transform:translateX(220%) rotate(12deg); } }
@media (max-width: 640px) { .slider-body { min-height: 46vh; padding: 7rem 1.25rem 6rem; } .slider-title { font-size: 2rem; } .slider-subtitle { font-size: .78rem; line-height: 1.8rem; } .story-dock { bottom: .5rem; } }
@media (prefers-reduced-motion: reduce) { .underwater-grid, .surface-shimmer, .water-light { animation: none; } }
</style>