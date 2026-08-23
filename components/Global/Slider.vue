<script setup lang="ts">
const containerRef = ref(null)
const props = defineProps(['items', 'h', 'loading', 'stories'])

useSwiper(containerRef, {
  effect: 'fade',
  loop: true,
  autoplay: { delay: 4000 },
  creativeEffect: {
    prev: { shadow: true, translate: [0, 0, -400] },
    next: { shadow: true, translate: [0, 0, -400] },
  },
})

const viewerOpen = ref(false)
const viewerIndex = ref(0)

function openStory(i: number) {
  viewerIndex.value = i
  viewerOpen.value = true
}

function sliderText(item: any) {
  return {
    eyebrow: item?.eyebrow || item?.category_name || item?.category?.name || item?.label || '',
    title: item?.title || item?.name || '',
    description: item?.description || item?.subtitle || item?.sub_title || item?.dis || item?.text || '',
    cta: item?.button_text || item?.buttonText || item?.cta_text || item?.cta || item?.action_text || '',
    secondaryCta: item?.secondary_button_text || item?.secondaryButtonText || '',
  }
}
</script>

<template>
  <div v-if="loading"><USkeleton class="h-[70vh]" :ui="{ background: 'bg-slate-900' }" /></div>

  <div v-else class="relative z-0 px-2 pt-2 lg:px-3">
    <template v-if="props?.items?.data?.length">
      <ClientOnly>
        <swiper-container ref="containerRef" :init="false" class="relative z-[1] block">
          <swiper-slide v-for="(item, idx) in items.data" :key="item?.id || idx" class="relative z-0">
            <div
              class="slider-body aqua-surface"
              :class="h"
              :style="{ backgroundImage: `linear-gradient(90deg, rgba(2,18,28,.82), rgba(3,35,49,.22) 58%, rgba(3,18,27,.58)), url(${item.file})` }"
            >
              <div class="underwater-grid" aria-hidden="true"></div>
              <div class="water-light light-one" aria-hidden="true"></div>
              <div class="water-light light-two" aria-hidden="true"></div>
              <div class="surface-shimmer" aria-hidden="true"></div>

              <div class="slider-copy">
                <span v-if="sliderText(item).eyebrow" class="eyebrow">{{ sliderText(item).eyebrow }}</span>
                <h4 v-if="sliderText(item).title" class="slider-title">{{ sliderText(item).title }}</h4>
                <p v-if="sliderText(item).description" class="slider-subtitle">{{ sliderText(item).description }}</p>

                <div v-if="item?.link && sliderText(item).cta" class="flex flex-wrap justify-center gap-3 sm:justify-start">
                  <NuxtLink :to="item.link" class="slider-cta">
                    {{ sliderText(item).cta }}
                    <UIcon name="material-symbols:arrow-back-rounded" />
                  </NuxtLink>
                  <NuxtLink v-if="sliderText(item).secondaryCta" to="/products" class="slider-ghost">
                    {{ sliderText(item).secondaryCta }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </template>

    <div
      v-else
      class="slider-body aqua-surface"
      :class="h"
      :style="{ backgroundImage: `linear-gradient(90deg, rgba(2,18,28,.82), rgba(3,35,49,.22) 58%, rgba(3,18,27,.58)), url(${items?.image})` }"
    >
      <div class="underwater-grid" aria-hidden="true"></div>
      <div class="water-light light-one" aria-hidden="true"></div>
      <div class="water-light light-two" aria-hidden="true"></div>
      <div class="surface-shimmer" aria-hidden="true"></div>

      <div class="slider-copy">
        <span v-if="sliderText(items).eyebrow" class="eyebrow">{{ sliderText(items).eyebrow }}</span>
        <h4 v-if="sliderText(items).title" class="slider-title">{{ sliderText(items).title }}</h4>
        <p v-if="sliderText(items).description" class="slider-subtitle">{{ sliderText(items).description }}</p>
        <NuxtLink v-if="items?.link && sliderText(items).cta" :to="items.link" class="slider-cta">
          {{ sliderText(items).cta }}
          <UIcon name="material-symbols:arrow-back-rounded" />
        </NuxtLink>
      </div>
    </div>

    <div v-if="stories?.data?.length" class="story-dock aqua-glass">
      <div class="overflow-x-auto" style="scrollbar-width: none">
        <div class="flex min-w-max gap-4 px-3 py-2">
          <div
            v-for="(story, i) in stories.data"
            :key="story.id || i"
            class="group flex w-16 cursor-pointer flex-col items-center gap-1"
            @click="openStory(i)"
          >
            <div class="story-ring">
              <div class="h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-slate-900/70">
                <img v-if="story.type === 'image'" :src="story.file" :alt="story.title || 'استوری'" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <img v-else-if="story.thumbnail" :src="story.thumbnail" :alt="story.title || 'استوری'" class="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                <div v-else class="flex h-full w-full items-center justify-center text-mainColor"><UIcon name="material-symbols:play-arrow" class="h-6 w-6" /></div>
              </div>
            </div>
            <span class="max-w-16 truncate text-center text-[10px] text-white/70">{{ story.title || 'استوری' }}</span>
          </div>
        </div>
      </div>
      <ClientOnly><StoryViewer v-if="viewerOpen" :stories="stories?.data ?? []" :start-index="viewerIndex" @close="viewerOpen = false" /></ClientOnly>
    </div>
  </div>
</template>

<style>
.slider-body {
  @apply relative z-0 flex w-full items-center overflow-hidden rounded-[28px] bg-cover bg-center px-7 py-16 text-white sm:px-12 lg:rounded-[36px] lg:px-20;
  min-height: min(72vh, 760px);
  box-shadow: 0 30px 90px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.14);
  isolation: isolate;
}

.slider-copy {
  @apply relative z-30 max-w-2xl text-center sm:text-right;
}

.eyebrow {
  @apply mb-4 inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs backdrop-blur-md sm:text-sm;
  color: color-mix(in srgb, var(--main-color) 85%, white);
}

.slider-title {
  @apply py-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-6xl;
  text-shadow: 0 8px 30px rgba(0,0,0,.35);
}

.slider-subtitle { @apply mb-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base; }

.slider-cta {
  @apply relative z-40 inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold text-slate-950 transition hover:-translate-y-1;
  background: var(--main-color);
  box-shadow: 0 0 30px color-mix(in srgb, var(--main-color) 28%, transparent);
}

.slider-ghost {
  @apply relative z-40 inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-md transition hover:bg-white/15;
}

.story-dock {
  @apply absolute bottom-3 left-1/2 w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 overflow-hidden rounded-[22px];
  z-index: 50;
}

.story-ring {
  @apply rounded-full p-[2px];
  background: linear-gradient(135deg, var(--main-color), color-mix(in srgb, var(--main-color) 45%, transparent), rgba(255,255,255,.3));
}

.water-light { position:absolute; z-index:2; width:24rem; height:24rem; border-radius:50%; filter:blur(70px); background:color-mix(in srgb, var(--main-color) 12%, transparent); pointer-events:none; animation:waterDrift 8s ease-in-out infinite alternate; }
.light-one { top:-8rem; left:-6rem; }
.light-two { right:10%; bottom:-12rem; animation-delay:-3s; }
.underwater-grid { position:absolute; z-index:3; inset:0; pointer-events:none; opacity:.12; background:repeating-linear-gradient(105deg, transparent 0 46px, color-mix(in srgb, var(--main-color) 18%, transparent) 48px 49px, transparent 51px 92px); mask-image:linear-gradient(to bottom, rgba(0,0,0,.7), transparent 75%); animation:caustics 11s ease-in-out infinite alternate; }
.surface-shimmer { position:absolute; z-index:4; top:-15%; left:-10%; width:60%; height:130%; pointer-events:none; background:linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent); transform:rotate(12deg); filter:blur(12px); animation:shimmer 10s ease-in-out infinite; }

@keyframes waterDrift { from { transform:translate3d(-3%,0,0) scale(.9); opacity:.45 } to { transform:translate3d(8%,8%,0) scale(1.15); opacity:.8 } }
@keyframes caustics { from { transform:translateX(-2%) scale(1); } to { transform:translateX(3%) scale(1.05); } }
@keyframes shimmer { 0%,35% { transform:translateX(-120%) rotate(12deg); } 70%,100% { transform:translateX(220%) rotate(12deg); } }

@media (max-width:640px) {
  .slider-body { min-height:46vh; padding:7rem 1.25rem 6rem; }
  .slider-title { font-size:2rem; }
  .slider-subtitle { font-size:.78rem; line-height:1.8rem; }
  .story-dock { bottom:.5rem; }
}

@media (prefers-reduced-motion:reduce) {
  .underwater-grid, .surface-shimmer, .water-light { animation:none; }
}
</style>
