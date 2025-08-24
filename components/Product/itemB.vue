<script setup lang="ts">
import {numberFormat} from "~/utils/helper";

const props = defineProps(['product','loading'])

</script>
<template>
  <div v-if="loading" class="w-100 h-[129px] bg-cover rounded-2xl relative">
    <USkeleton class="h-[129px]"/>
  </div>
  <nuxt-link v-else :to="'/products/'+product?.slug">
    <div class="w-100 h-[129px] bg-cover rounded-2xl relative"
         :style="{ backgroundImage: `url(${product.primary_image})` }">
      <h4 class="font-bold text-xl absolute bottom-2 right-2">{{ product?.name }}</h4>
      <p class="absolute bottom-2 left-2">{{numberFormat(product?.price)}} تومان</p>
    </div>
  </nuxt-link>
</template>