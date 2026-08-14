<script setup lang="ts">
definePageMeta({
  middleware: 'guest'
})

useSeoMeta({
  title: 'ورود | اسلیپر پاز',
  robots: 'noindex, nofollow'
})

useHead({
  title: 'ورود به اکانت'
})

const showCheckOTP = ref(false)
</script>

<template>
  <u-container>
    <div class="w-full h-screen flex justify-center items-center">
      <template v-if="showCheckOTP">
        <transition appear-active-class="fade-in-iamge">
          <AuthCheckOTP />
        </transition>
      </template>
      <template v-else>
        <transition appear-active-class="fade-in-iamge">
          <auth-login @show-check-otp-form="() => showCheckOTP = true" />
        </transition>
      </template>
    </div>
  </u-container>
</template>
