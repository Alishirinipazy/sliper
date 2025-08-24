<script setup lang="ts">
import { Tabs, Tab } from "vue3-tabs-component";
const { public: { apiBase } } = useRuntimeConfig();
const { data: products, error,pending } = await useFetch(`${apiBase}/products/products-tabs`)
</script>
<template>
  <section class="food_section layout_padding-bottom my-2">
    <div class="bg-mainColor rounded-2xl p-3">
      <div class="flex justify-between">
        <h6 class=" text-xl font-bold">
          جدید ترین محصولات
        </h6>
        <div class="btn bg-secColor rounded-2xl text-white px-2">
          <NuxtLink to="/products">
            مشاهده بیشتر
            <icon name="material-symbols:arrow-back-ios-rounded" class="relative top-1"/>
          </NuxtLink>
        </div>
      </div>
      <Tabs nav-class="filters_menu" nav-item-active-class="active"
            :options="{ useUrlFragment: false, disableScrollBehavior: true }">
        <Tab v-for="(tablist, index) in products?.data?.tabList" :key="index" :name="tablist">
          <div class="container">
            <div class="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4  ">
              <div v-for="product in products?.data?.tabPanel[index]" :key="product.id"
                   class="">
                <ProductItemB :product="product" :loading="pending" />
              </div>

            </div>
          </div>
        </Tab>

      </Tabs>


    </div>

  </section>
</template>
<style >
.filters_menu {
  @apply flex justify-center p-2
}
.tabs-component-tab {
  @apply mx-2 bg-secColor px-2 py-1 text-white rounded
}
.active {
  @apply text-mainColor
}
</style>