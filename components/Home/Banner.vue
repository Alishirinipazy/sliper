<script setup lang="ts">
const props = defineProps(['dataBanner'])
</script>
<template>

  <div class="grid grid-flow-col grid-rows-12   sm:grid-rows-3  lg:grid-rows-3 gap-5 my-5 py-3">
    <template v-for="(item,index) in dataBanner " :key="index">

      <div :class="item.class" :style="{ backgroundImage: `url(${item.image})` }">
        <nuxt-link :to="item.link">
          <p class="banner-dis">
            {{ item.dis }}
          </p>
        </nuxt-link>
      </div>

    </template>

  </div>
</template>
<style>
.col-bg-temp {
  @apply bg-cover  h-[129px] col-span-1 rounded-2xl bg-center  relative
}

.row-bg-temp {
  @apply relative row-span-3  bg-no-repeat bg-cover bg-center rounded-2xl
}

.banner-dis {
  @apply absolute w-full transition lg:text-xl delay-700 hover:transition  duration-300 ease-in-out hover:to-mainColor  bottom-0 p-3 bg-gradient-to-b from-neonColor to-secColor to-100% rounded-b-2xl text-cyan-50
}

</style>