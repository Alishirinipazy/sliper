<script setup>
useSeoMeta({
  title: 'سبد خرید | اسلیپر پاز',
  description: 'مشاهده و تکمیل سبد خرید اسلیپر پاز'
})
</script>

<template>
  <div class="cart-page min-h-screen">
    <LayoutsHeader :fixed="true" />

    <main class="mx-auto max-w-6xl px-3 sm:px-5 pt-14 pb-10 lg:pt-6">
      <div class="mb-6">
        <p class="text-sm text-mainColor font-bold mb-2">خریدت آماده‌ست</p>
        <h1 class="text-2xl sm:text-3xl font-black text-white">سبد خرید</h1>
        <p class="mt-2 text-sm text-white/45">محصولات، روش ارسال و اطلاعات پرداخت را اینجا کامل کن.</p>
      </div>

      <section class="cart-page-card">
        <ProductCart />
      </section>
    </main>
  </div>
</template>

<style scoped>
.cart-page {
  background:
    radial-gradient(circle at 12% 8%, rgba(255,190,51,.12), transparent 28rem),
    radial-gradient(circle at 88% 22%, rgba(229,139,154,.10), transparent 26rem),
    linear-gradient(180deg, #071b24 0%, #111b20 52%, #1c1b22 100%);
}

.cart-page-card {
  @apply rounded-[30px] border border-mainColor/15 bg-white/[.035] shadow-[0_25px_80px_rgba(0,0,0,.28)] overflow-hidden;
}

:deep(.cart-shell) {
  background: transparent;
}
</style>