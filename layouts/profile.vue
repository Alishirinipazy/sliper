<script setup>
const {authUser} = useAuth()
const route = useRoute()
const toast = useToast()

async function logout() {
  await useFetch('/api/auth/logout', { method: 'POST' })
  authUser.value = null
  toast.remove('ناززییی... خروج با موفقیت انجام شد')
  return navigateTo('/')
}
</script>

<template>
  <section class="profile-layout lg:grid lg:grid-cols-12 gap-3">
    <aside class="profile-aside-header">
      <ul class="list">
        <li class="list-group-item lg:hidden"><NuxtLink to="/"><UIcon name="material-symbols:other-houses"/><p>خوونه</p></NuxtLink></li>
        <li class="list-group-item"><NuxtLink to="/profile/" :class="{'profile-active': route.path==='/profile/'}"><UIcon name="material-symbols:order-approve-rounded"/><p>اطلاعاتت</p></NuxtLink></li>
        <li class="list-group-item"><NuxtLink to="/profile/addresses" :class="{'profile-active': route.path==='/profile/addresses'}"><UIcon name="bitcoin-icons:address-book-filled"/><p>آدرس ها</p></NuxtLink></li>
        <li class="list-group-item"><NuxtLink to="/profile/order" :class="{'profile-active': route.path==='/profile/order'}"><UIcon name="material-symbols:order-approve-rounded"/><p>سفارشات</p></NuxtLink></li>
        <li class="list-group-item"><NuxtLink to="/profile/transactions" :class="{'profile-active': route.path==='/profile/transactions'}"><UIcon name="bitcoin-icons:transactions-filled"/><p>تراکنش ها</p></NuxtLink></li>
        <li class="list-group-item"><a href="#" @click.prevent="logout"><UIcon name="ion:exit"/><p>خروج</p></a></li>
      </ul>
    </aside>
    <div class="col-span-10 lg:pl-2 my-2 p-2 min-w-0 profile-content"><slot/></div>
  </section>
</template>

<style scoped>
.profile-layout { @apply relative z-10 min-h-[calc(100vh-2rem)] pb-20 lg:pb-0; }
.list { @apply text-center lg:py-8 lg:m-3 lg:mx-5 flex lg:block justify-center w-full; }
.list-group-item { @apply text-white lg:m-3 p-1 lg:p-3 lg:rounded-2xl m-1 bg-[#1c1b22] border border-mainColor/10 transition hover:border-mainColor/35; }
.list-group-item a { @apply flex items-center justify-center gap-2 rounded-xl px-2 py-2 transition; }
.list-group-item :deep(svg) { @apply w-5 h-5 shrink-0; }
.profile-active { @apply text-mainColor bg-mainColor/10; }
.profile-aside-header { @apply lg:h-[85vh] lg:col-span-2 text-white lg:border-mainColor lg:border-2 lg:rounded-2xl lg:bg-[#111b20]/90 lg:m-1 flex items-center w-full backdrop-blur-xl shadow-[0_18px_55px_rgba(0,0,0,.18)]; }
@media (max-width: 1023px) {
  .profile-aside-header { @apply fixed bottom-0 inset-x-0 z-[140] bg-[#071b24]/95 border-t border-mainColor/20 backdrop-blur-2xl px-1 py-1; }
  .list { @apply flex items-stretch gap-1 m-0 p-0 max-w-2xl mx-auto; }
  .list-group-item { @apply flex-1 min-w-0 m-0 p-0 bg-transparent border-0; }
  .list-group-item a { @apply min-h-14 flex-col gap-1 px-1 py-2 text-[10px] text-white/60; }
  .list-group-item a:hover { @apply bg-white/5; }
  .profile-active { @apply bg-mainColor/10 text-mainColor; }
}
@media (max-width: 380px) {
  .list-group-item a { @apply min-h-12 text-[9px]; }
  .list-group-item :deep(svg) { @apply w-4 h-4; }
}
</style>