<script setup lang="ts">

const props = defineProps(['items']);

</script>

<template>

  <div class="relative">
    <UCarousel v-if="Array.isArray(props.items)" v-slot="{ item }" class="h-full w-full" :items="props.items" :ui="{ item: 'basis-full' }"
               indicators>
      <div class="w-full px-12 flex flex-col justify-center align-sub  bg-no-repeat bg-cover bg-center"
           style="height:90vh; direction: rtl" :style="{ backgroundImage: 'url(' + item.image + ')'}">
        <h4 class="py-2 sm:text-4xl font-bold  text-amber-800/80">{{ item.title }}</h4>
        <p class="py-2 font-bold  text-amber-800/80">{{ item.dis }}</p>
        <nuxt-link to="/product">
          <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
        </nuxt-link>
      </div>
    </UCarousel>
    <div v-else class="w-full px-12 flex flex-col justify-center align-sub  bg-no-repeat bg-cover bg-center"
         style="height:90vh; direction: rtl" :style="{ backgroundImage: 'url(' + items.image + ')'}">
      <h4 class="py-2 sm:text-4xl font-bold  text-amber-800/80">{{ items.title }}</h4>
      <p class="py-2 font-bold  text-amber-800/80">{{ items.dis }}</p>
      <nuxt-link to="/product">
        <UButton class="rounded-full my-2" label="همین الان بخرش" color="yellow"/>
      </nuxt-link>
    </div>
    <div class="absolute bottom-0 z-20 w-full rounded-t-full dark:bg-gray-800 h-5">

    </div>
  </div>
</template>

