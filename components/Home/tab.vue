<script setup lang="ts">
import { Tabs, Tab } from "vue3-tabs-component";
const { public: { apiBase } } = useRuntimeConfig();
const { data: products, error,pending } = await useFetch(`${apiBase}/products/products-tabs`)
</script>
<template>
  <section class="food_section layout_padding-bottom my-2">
    <div class="  ">

      <!-- Header -->


      <!-- Tabs -->
      <div class="p-4">
        <Tabs
            nav-class="filters_menu flex flex-wrap gap-2 border-b border-secColor/10 pb-3 mb-4"
            nav-item-class="px-4 py-2 rounded-full text-sm font-medium text-gray-500 cursor-pointer transition-all duration-200 hover:bg-secColor/10 hover:text-secColor"
            nav-item-active-class="!bg-secColor !text-white shadow-md"
            :options="{ useUrlFragment: false, disableScrollBehavior: true }"
        >
          <Tab
              v-for="(tablist, index) in products?.data?.tabList"
              :key="index"
              :name="tablist"
          >
            <div
                v-if="products?.data?.tabPanel[index]?.length"
                class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5"
            >
              <div
                  v-for="product in products?.data?.tabPanel[index]"
                  :key="product.id"
                  class="transition-transform duration-200 hover:-translate-y-1 "
              >
                <ProductItemB :product="product" :loading="pending" />
              </div>
            </div>

            <!-- Empty state -->
            <div
                v-else
                class="flex flex-col items-center justify-center py-12 text-gray-400"
            >
              <icon name="material-symbols:inventory-2-outline" class="text-4xl mb-2" />
              <span class="text-sm">محصولی یافت نشد</span>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>
  </section>
</template>
<style >
.filters_menu {
  @apply flex justify-center p-2
}
.tabs-component-tab {
  @apply mx-2 bg-secColor px-2 py-1 text-white rounded text-sm lg:text-xl
}
.active {
  @apply text-mainColor
}
</style>