<script setup lang="ts">


import AboutDetail from "~/components/Test/AboutDetail.vue";
import Content from "~/components/Test/Content.vue";
import Feature from "~/components/Test/Feature.vue";
</script>

<template>
  <TestHeader/>
  <u-container>
    <TestSlider h="lg:h-[50vh] h-[40vh] "/>
    <AboutDetail/>
    <Content/>
    <Feature/>
  </u-container>
    <TestFooter/>
</template>

<style>
.center-elments {
  @apply flex justify-center items-center
}
</style>