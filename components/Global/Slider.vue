<script setup lang="ts">

const props = defineProps(['items','h']);

</script>

<template>

  <div class="relative">
    <UCarousel v-if="Array.isArray(props.items)" v-slot="{ item }" class="h-full w-full" :items="props.items"
               :ui="{ item: 'basis-full' }"
               indicators>
      <div class="slider-body justify-center "
           :style="{ backgroundImage: 'url(' + item.image + '); direction: rtl',height:h}">
        <h4 class="slider-title">{{ item.title }}</h4>
        <p class="slider-dis">{{ item.dis }}</p>
        <nuxt-link to="/product">
          <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
        </nuxt-link>
      </div>
    </UCarousel>
    <div v-else class="slider-body justify-end "
         style="direction: rtl" :style="{ backgroundImage: 'url(' + items.image + ')',height:h,}">
      <h4 class="slider-title " >{{ items.title }}</h4>
      <p class="slider-dis">{{ items.dis }}</p>
      <nuxt-link v-if="items.link" :to="items.link">
        <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
      </nuxt-link>
    </div>

    <div class="absolute hidden lg:block bottom-0 z-10 w-full rounded-t-full bg-white dark:bg-darkColor h-5">

    </div>
  </div>
</template>
<style>
.slider-body {
  @apply w-full lg:px-12 text-center flex flex-col align-sub  bg-no-repeat bg-cover bg-center py-4 text-mainColor font-bold sm:text-right
}

.slider-title {
  @apply py-2 text-3xl lg:text-4xl font-bold
}

.slider-dis {
  @apply py-2 text-cosColor
}
</style>
