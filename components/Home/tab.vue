<script setup lang="ts">
import { Tabs, Tab } from "vue3-tabs-component";
const { public: { apiBase } } = useRuntimeConfig();
const { data: products, error, pending } = await useFetch(`${apiBase}/products/products-tabs`)
</script>

<template>
  <section class="home-tabs my-5">
    <div class="tabs-heading"><div><span>دسته‌بندی‌ها</span><h2>برای قدم‌های راحت‌تر انتخاب کن</h2></div></div>
    <div class="p-2 sm:p-4">
      <Tabs nav-class="filters_menu" nav-item-class="tab-item" nav-item-active-class="!tab-item-active" :options="{ useUrlFragment: false, disableScrollBehavior: true }">
        <Tab v-for="(tablist, index) in products?.data?.tabList" :key="index" :name="tablist">
          <div v-if="products?.data?.tabPanel[index]?.length" class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-2 gap-3 sm:gap-5">
            <div v-for="product in products?.data?.tabPanel[index]" :key="product.id" class="transition-transform duration-300 hover:-translate-y-1">
              <ProductItemB :product="product" :loading="pending" />
            </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center py-12 text-cyan-50/40"><UIcon name="material-symbols:inventory-2-outline" class="text-4xl mb-2"/><span class="text-sm">محصولی یافت نشد</span></div>
        </Tab>
      </Tabs>
    </div>
  </section>
</template>

<style>
.home-tabs { @apply rounded-[30px] p-2 sm:p-4; background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.02)); border: 1px solid rgba(169,238,255,.08); }
.tabs-heading { @apply px-2 pt-2 pb-1; }.tabs-heading span { @apply text-xs text-cyan-300/70; }.tabs-heading h2 { @apply text-lg sm:text-xl font-black text-white mt-1; }
.filters_menu { @apply flex justify-start gap-2 overflow-x-auto p-2 mb-4; scrollbar-width:none; }
.tab-item { @apply shrink-0 px-4 py-2 rounded-full text-sm font-medium text-cyan-50/55 cursor-pointer transition-all duration-300 border border-white/10 bg-white/[.04] hover:bg-white/[.09] hover:text-white; }
.tab-item-active { @apply !bg-cyan-300/15 !text-cyan-100 !border-cyan-200/25 shadow-[0_0_22px_rgba(49,216,255,.12)]; }
</style>