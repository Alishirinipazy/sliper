<script setup></script>
<template>
  <div class="grid grid-flow-col grid-rows-12   sm:grid-rows-3  lg:grid-rows-3 gap-5 my-5 py-3">
    <div class="row-bg-temp"><p class="banner-dis">
      متن تستی
    </p></div>
    <div class="row-bg-temp" ></div>
    <div class="col-bg-temp"></div>
    <div class="col-bg-temp"></div>
    <div class="col-bg-temp"></div>
  </div>
</template>
<style>
.col-bg-temp {
  @apply bg-cover h-[129px] col-span-1 rounded-2xl bg-bottom bg-[url(/images/img_1.png)] relative
}

.row-bg-temp {
  @apply relative row-span-3 bg-pink-300  bg-no-repeat bg-cover bg-center rounded-2xl bg-[url(https://s3-alpha-sig.figma.com/img/4a6f/9c7c/4e1a4ea7eb5dfc8de7982f880f8eaf19?Expires=1741564800&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=IF1asxMEBfreOGfrQEKVf6O0zr1S~Le18hulYy0v3kadfDIft4M2PxrfVJEKd7o8WDDM3Y-4yqbrIrFF2oWBwPhGSu1-1gc5e3ueO8oxQBqswujHcUKzedbLCzynVqrxxAJ8WQrIKU6BlQ99bumg1J7X7cXjtev4NG~tpZQoWwAfPYPCRrClxbHPKhtmP68YamDfXKXp0fJ3ns6mj8MzqK6SCDS8dnb~VXKhkrj5xj4StQsAl2FWeyag5x8H6E2zzWVPHQjJT9bbL49mE7~ZqzSU3k2HMEqscbxYEBArMnj6bgPlMGxqrqVORorFghyfpwuQcD4byABbpp~CjMw3dw__)]
}

.banner-dis {
  @apply absolute w-full  bottom-0 p-3 bg-gradient-to-b from-neonColor to-black to-100% rounded-b-2xl
}

</style>