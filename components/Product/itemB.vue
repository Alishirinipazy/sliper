<script setup lang="ts">
import {numberFormat} from "~/utils/helper";

const props = defineProps(['product','loading'])

</script>
<template>
  <div v-if="loading" class="w-100 h-[129px] bg-cover rounded-2xl relative">
    <USkeleton class="h-[90vh]"/>
  </div>
  <nuxt-link v-else :to="'/products/'+product?.slug">
    <div class="w-100 h-[320px] bg-cover rounded-2xl relative border-2 border-secColor text-white overflow-hidden bg-center"
         :style="{ backgroundImage: `url(${product.primary_image})` }">
      <h4 class="font-bold absolute bottom-0 left-0 text-mainColor p-1 rounded-tl-2xl" >{{ product?.name }}</h4>

    </div>
  </nuxt-link>
</template>