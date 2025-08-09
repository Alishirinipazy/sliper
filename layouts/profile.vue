<script setup>
const {authUser} = useAuth()
const route = useRoute()
</script>
<template>
  <section class="lg:grid grid-cols-12">
    <aside class="profile-aside-header">


      <ul class="list">
        <li class="list-group-item lg:hidden">
          <NuxtLink to="/">
            <UIcon name="material-symbols:other-houses" class="w-5 h-5 lg:hidden"/>
            <p>خوونه</p></NuxtLink>
        </li>
        <li class="list-group-item ">
          <NuxtLink to="/profile/" :class="{'text-cosColor': route.path==='/profile/'}">
            <UIcon name="material-symbols:order-approve-rounded" class="w-5 h-5 lg:hidden"/>
            <p>اطلاعاتت</p>
          </NuxtLink>
        </li>
        <li class="list-group-item">
          <NuxtLink to="/profile/addresses" :class="{'text-cosColor': route.path==='/profile/addresses'}">
            <UIcon name="bitcoin-icons:address-book-filled" class="w-5 h-5 lg:hidden"/>
            <p>آدرس ها</p></NuxtLink>

        </li>
        <li class="list-group-item">
          <NuxtLink to="/profile/order">
            <UIcon name="material-symbols:order-approve-rounded" class="w-5 h-5 lg:hidden"/>
            <p>سفارشات</p></NuxtLink>
        </li>
        <li class="list-group-item">
          <nuxt-link to="/profile/transactions">
            <UIcon name="bitcoin-icons:transactions-filled" class="w-5 h-5 lg:hidden"/>
            <p>تراکنش ها</p>
          </nuxt-link>
        </li>
        <li class="list-group-item">
          <a href="#" @click="logout">
            <UIcon name="ion:exit" class="w-5 h-5 lg:hidden"/>
            <p>خروج</p>
          </a>
        </li>
      </ul>
    </aside>
    <div class="col-span-9">
      <div class="vh-70">
        <div class="row g-4">
          <slot/>
        </div>
      </div>
    </div>
  </section>
</template>
<style>
.list {
  @apply text-center lg:py-10 lg:m-3 lg:mx-5 flex lg:block justify-center w-full
}

.list-group-item {
  @apply text-white lg:m-3 p-1 lg:p-3 lg:rounded-2xl   m-1 bg-secColor
}

.profile-aside-header {
  @apply lg:h-[85vh] lg:col-span-2 text-secColor lg:border-mainColor lg:border-2 lg:rounded-2xl lg:bg-gray-200 m-1 flex items-center w-full
}

@media (max-width: 500px) {
  .profile-aside-header {
    @apply fixed lg:hidden text-sm  -bottom-1 flex flex-grow justify-center w-full z-20 bg-secColor
  }

  .profile-aside-header h3 {
    @apply hidden
  }


}
</style>