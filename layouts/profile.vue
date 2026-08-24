<script setup>
const {authUser} = useAuth()
const route = useRoute()
const toast = useToast();

async function logout() {
  await useFetch("/api/auth/logout", { method: 'POST' })
  authUser.value = null;
  toast.remove("ناززییی... خروج با موفقیت انجام شد")
  return navigateTo('/')
}
</script>

<template>
  <section class="profile-layout lg:grid grid-cols-12 gap-3">
    <aside class="profile-aside-header">
      <ul class="list">
        <li class="list-group-item lg:hidden">
          <NuxtLink to="/"><UIcon name="material-symbols:other-houses" class="w-5 h-5 lg:hidden"/><p>خوونه</p></NuxtLink>
        </li>
        <li class="list-group-item">
          <NuxtLink to="/profile/" :class="{'profile-active': route.path==='/profile/'}"><UIcon name="material-symbols:order-approve-rounded" class="w-5 h-5 lg:hidden"/><p>اطلاعاتت</p></NuxtLink>
        </li>
        <li class="list-group-item">
          <NuxtLink to="/profile/addresses" :class="{'profile-active': route.path==='/profile/addresses'}"><UIcon name="bitcoin-icons:address-book-filled" class="w-5 h-5 lg:hidden"/><p>آدرس ها</p></NuxtLink>
        </li>
        <li class="list-group-item">
          <NuxtLink to="/profile/order" :class="{'profile-active': route.path==='/profile/order'}"><UIcon name="material-symbols:order-approve-rounded" class="w-5 h-5 lg:hidden"/><p>سفارشات</p></NuxtLink>
        </li>
        <li class="list-group-item">
          <NuxtLink to="/profile/transactions" :class="{'profile-active': route.path==='/profile/transactions'}"><UIcon name="bitcoin-icons:transactions-filled" class="w-5 h-5 lg:hidden"/><p>تراکنش ها</p></NuxtLink>
        </li>
        <li class="list-group-item">
          <a href="#" @click="logout"><UIcon name="ion:exit" class="w-5 h-5 lg:hidden"/><p>خروج</p></a>
        </li>
      </ul>
    </aside>
    <div class="col-span-10 lg:pl-2 my-2 p-2 min-w-0">
      <slot/>
    </div>
  </section>
</template>

<style scoped>
.profile-layout { @apply relative z-10 min-h-[calc(100vh-2rem)]; }
.list { @apply text-center lg:py-10 lg:m-3 lg:mx-5 flex lg:block justify-center w-full; }
.list-group-item { @apply text-white lg:m-3 p-1 lg:p-3 lg:rounded-2xl m-1 bg-[#1c1b22] border border-mainColor/10 transition hover:border-mainColor/35; }
.list-group-item a { @apply flex items-center justify-center gap-2 rounded-xl px-2 py-1.5 transition; }
.profile-active { @apply text-mainColor bg-mainColor/10; }
.profile-aside-header { @apply lg:h-[85vh] lg:col-span-2 text-white lg:border-mainColor lg:border-2 lg:rounded-2xl lg:bg-[#111b20]/90 m-1 flex items-center w-full backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,.18)]; }
@media (max-width: 1023px) {
  .profile-aside-header { @apply fixed bottom-0 left-0 right-0 text-sm z-[120] bg-[#111b20]/95 border-t border-mainColor/20; }
}
@media (max-width: 500px) {
  .profile-aside-header { @apply -bottom-1 flex flex-grow justify-center w-full; }
  .profile-aside-header h3 { @apply hidden; }
}
</style>