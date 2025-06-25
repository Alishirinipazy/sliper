<script setup lang="ts">
definePageMeta({
  middleware:'guest'
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
      <auth-login  @show-check-otp-form="() => showCheckOTP = true"  />
      </transition>
      </template>
    </div>
  </u-container>
</template>