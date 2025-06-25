<script setup>
definePageMeta({
  middleware:'auth'
})
useHead({
  title: 'اکانت'
})
</script>
<template>
  <layouts-header :fixed="true"/>
<nuxt-layout name="profile">
  <nuxt-page/>
</nuxt-layout>
</template>