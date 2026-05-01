<script setup>
useHead({
  titleTemplate: '%s | اسلیپر ',

})
</script>
<template>

  <NuxtLoadingIndicator color="#ffbe33" />
  <nuxt-page />
  <UNotifications />
</template>
<style>
body {
  @apply bg-slate-200
}
</style>