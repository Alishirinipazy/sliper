<script setup lang="ts">

const props = defineProps(['pages'])
const route = useRoute()
const router = useRouter();
console.log(route)
function sendPageHandler(url){
  const page = new URL(url).searchParams.get("page");

const pages = {page:page}

  router.push({
    path: route?.path,
    query: pages
  })
}
</script>

<template>
  <div class="m-3 text-center ">


    <div class="flex justify-center w-full h-100">
      <template v-if="pages" v-for="(page,index) in pages" :key="index">
      <div v-if="page?.url"  class="flex justify-center items-center hover:bg-amber-300 transition cursor-pointer  border m-1 rounded w-[30px] h-[30px] "
           :class="page?.active?'bg-mainColor text-secColor':'bg-secColor text-white'"
            @click="sendPageHandler(page?.url)" >

        <p v-if="page?.label?.includes('قبلی') " > &laquo;</p>
        <p v-else-if="page?.label?.includes('بعدی')"> &raquo;</p>
        <p v-else>{{ page?.label }}</p>
      </div>
      </template>
      <div v-else class="flex justify-center items-center" v-for="(item,index) in 6">
        <p class="">
          <USkeleton class="h-6 w-6 m-1 "/>
        </p>
      </div>
    </div>

  </div>
</template>
