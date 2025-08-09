<script setup lang="ts">
const { data,refresh } = await useFetch('/api/profile/addressess', {
  headers: useRequestHeaders(['cookie'])
})
</script>

<template>
صفحه آدرس
  <UTable :rows="data?.addresses" />
</template>

<style scoped>

</style>