<script setup lang="ts">

const props = defineProps(['h'])


</script>

<template>

  <div class="slider-body2 items-center lg:items-start lg:justify-start bg-[url(/images/testBanner.jpg)]  " :class="h">
    <div class="slider-title2">
      <p>درباره ای ما بیشتر بدانید...</p>
      <p class="font-[Pacifico] font-light ">about <span class="text-test-main font-[Pacifico]">us</span></p>
    </div>

  </div>
    <div class="flex w-100 justify-center relative bottom-20">
      <p>
        <svg width="103" height="103" viewBox="0 0 103 103" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M102 0.750005L51.375 51.375L0.749995 0.749996" stroke="#634832" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M102 51.375L51.375 102L0.749995 51.375" stroke="#634832" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round"/>
        </svg>
      </p>
    </div>

</template>

<style lang="css" scoped>
.slider-body2 {
  @apply w-full lg:rounded-3xl mt-6  flex flex-col align-sub  lg:bg-no-repeat bg-cover bg-top   font-bold sm:text-right
}

.slider-title2 {
  @apply lg:w-4/12 w-8/12 flex justify-between bg-white px-3 py-2 text-test-back lg:text-xl
}


</style>
