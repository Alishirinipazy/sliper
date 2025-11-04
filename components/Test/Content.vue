<script setup lang="ts">
const items = ref(['/images/img_8.png', '/images/img_9.png', '/images/img_8.png', '/images/img_8.png', '/images/img_9.png', '/images/img_9.png', '/images/img_8.png'])
</script>

<template>
  <div class="bg-gradient-to-b from-[#F9F9F9] to-white to-80% rounded-t-[100%] px-12 py-8">
    <div class="flex justify-center items-center text-test-back  py-10">
      <p class=""><span class="text-test-main text-xl font-bold">همکاری با بزرگان!</span> <br> با برند هایی که همکاری
        کردیم</p>
      <p class="font-[Pacifico] text-4xl px-4">our<span class="text-test-main font-[Pacifico]">Clients</span></p>
    </div>
    <ul class="flex justify-around">
      <li v-for="(item ,index) in items" :key="index">
        <img :src="item" alt="" width="129" height="106">

      </li>
    </ul>

  </div>
</template>

<style scoped>

</style>