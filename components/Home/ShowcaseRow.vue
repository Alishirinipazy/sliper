<script setup lang="ts">
// یک ردیف افقی از محصولات منتخب (تخفیف‌ها / پرفروش‌ها / جدیدترین‌ها)
defineProps<{
  kicker: string
  title: string
  products: any[]
  link: string
  tone?: 'sale' | 'best' | 'new'
}>()
</script>

<template>
  <section v-if="products?.length" v-reveal class="showcase">
    <div class="flex items-end justify-between gap-3 px-1 pb-3">
      <div>
        <span class="showcase-kicker" :class="`tone-${tone || 'new'}`">{{ kicker }}</span>
        <h2 class="text-xl font-black text-secColor sm:text-2xl">{{ title }}</h2>
      </div>
      <NuxtLink :to="link" class="see-all-link">
        مشاهده همه
        <UIcon name="material-symbols:arrow-back-rounded"/>
      </NuxtLink>
    </div>

    <div class="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-4 sm:mx-0 sm:px-0">
      <div v-for="(p, i) in products" :key="p.id" v-reveal="Math.min(i, 5) * 70"
           class="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[18%]">
        <ProductTile :product="p"/>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  @apply my-6 rounded-[2rem] bg-white/60 p-3 backdrop-blur sm:p-5;
}

.showcase-kicker {
  @apply mb-1 inline-block rounded-full px-3 py-0.5 text-xs font-bold;
}

.tone-sale {
  @apply bg-cosColor/15 text-cosColor;
}

.tone-best {
  @apply bg-mainColor/25 text-secColor;
}

.tone-new {
  @apply bg-secColor/10 text-secColor;
}

.see-all-link {
  @apply inline-flex items-center gap-1 text-sm text-slate-600 transition hover:text-secColor;
}
</style>
