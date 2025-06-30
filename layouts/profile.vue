<script setup>
const {authUser}= useAuth()
const route = useRoute()
</script>
<template>
  <section class="lg:grid grid-cols-12">
  <aside class="lg:h-[87vh] col-span-2 bg-mainColor">
    <h3 class="text-center lg:py-10 font-bold">{{authUser?.name}} عزیز</h3>
    <ul class="list">
      <li class="list-group-item " >
        <NuxtLink to="/profile/" :class="{'text-cosColor': route.path==='/profile/'}">اطلاعات کاربر</NuxtLink>
      </li>
      <li class="list-group-item">
        <NuxtLink to="/profile/addresses">آدرس ها</NuxtLink>

      </li>
      <li class="list-group-item">
        <NuxtLink to="/profile/order">سفارشات</NuxtLink>
      </li>
      <li class="list-group-item">
        <nuxt-link to="/profile/transactions">تراکنش ها</nuxt-link>
      </li>
      <li class="list-group-item">
        <a href="#" @click="logout">خروج</a>
      </li>
    </ul>
  </aside>
    <div class="col-span-10">
      <div class="vh-70">
        <div class="row g-4">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
<style>
.list {
  @apply text-center lg:py-10 lg:m-3 lg:mx-5 flex lg:block justify-center
}
.list-group-item {
  @apply  text-white lg:m-3 lg:p-3 rounded-2xl p-1 m-1 bg-secColor
}
</style>