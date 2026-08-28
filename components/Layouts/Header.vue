<script setup lang="ts">
import {useModalStore} from '@/stores/cart'

const store = useModalStore()
const searchOpen = ref(false)
const searchTerm = ref('')
const router = useRouter()
const {authUser} = useAuth()
const props = defineProps(['fixed'])
const classHeader = ref(props?.fixed ? 'header-block' : 'header')

const searchSuggestions = computed(() => {
  const value = searchTerm.value.trim()
  if (!value) return ['اسلیپر پاز', 'دمپایی', 'کفش راحتی']
  if (value === 'اسلیپر' || value === 'اسلیپر پاز') return ['اسلیپر پاز']
  return []
})

function submitSearch(term = searchTerm.value) {
  const value = String(term || '').trim()
  if (!value) return
  const normalized = value === 'اسلیپر' ? 'اسلیپر پاز' : value
  searchTerm.value = normalized
  searchOpen.value = false
  router.push({ path: '/products', query: { search: normalized } })
}

onMounted(() => {
  if (props?.fixed) return
  const updateHeader = () => {
    classHeader.value = document.documentElement.scrollTop <= 30 ? 'header' : 'header-scroll'
  }
  updateHeader()
  window.addEventListener('scroll', updateHeader, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', updateHeader))
})
</script>

<template>
  <header class="transition-all duration-500 ease-out" :class="classHeader">
    <u-container>
      <div class="nav-shell aqua-glass">
        <nav class="hidden lg:flex flex-1 items-center gap-2" aria-label="منوی اصلی">
          <nuxt-link to="/" class="nav-link" :class="{'nav-link-active': $route.path==='/' }">خونه</nuxt-link>
          <nuxt-link to="/products" class="nav-link" :class="{'nav-link-active': $route.path==='/products' }">محصولاتمون</nuxt-link>
          <nuxt-link to="/about" class="nav-link" :class="{'nav-link-active': $route.path==='/about' }">دربارمون</nuxt-link>
          <nuxt-link to="/contact" class="nav-link" :class="{'nav-link-active': $route.path==='/contact' }">تماس با ما</nuxt-link>
        </nav>

        <nuxt-link to="/" class="logo-wrap" aria-label="اسلیپر پاز">
          <img src="/images/logo.avif" class="w-[112px] sm:w-[126px]" alt="اسلیپر پاز">
        </nuxt-link>

        <div class="flex flex-1 justify-end items-center gap-2">
          <button type="button" class="icon-action hidden sm:flex" aria-label="جستجو" @click="searchOpen = true">
            <UIcon name="material-symbols:search-rounded" class="w-5 h-5"/>
          </button>
          <button type="button" class="icon-action relative hidden lg:flex" aria-label="سبد خرید" @click="store?.changeStatusModal()">
            <UIcon name="material-symbols:shopping-cart-outline-rounded" class="w-5 h-5"/>
            <UChip v-if="store?.allItem?.length" :text="store?.allItem?.length" size="sm" class="absolute -top-1 -right-1" :ui="{background:'bg-mainColor text-secColor'}"/>
          </button>
          <nuxt-link to="/auth/login" v-if="!authUser" class="aqua-cta">
            <span class="hidden md:inline">ثبت نام | ورود</span><UIcon name="octicon:sign-in-16" class="w-5 h-5"/>
          </nuxt-link>
          <nuxt-link to="/profile/" v-else class="aqua-cta" :class="{'aqua-cta-active': $route.path.includes('profile')}" >
            <span class="hidden md:inline">{{ authUser?.name }}</span><UIcon name="material-symbols:account-circle" class="w-5 h-5"/>
          </nuxt-link>
        </div>
      </div>
    </u-container>

    <div class="mobile-nav">
      <button class="mobile-nav-item" :class="{'mobile-active': $route.path==='/' }" @click="router.push('/')">
        <UIcon name="material-symbols:other-houses" class="w-5 h-5"/><span>خوونه</span>
      </button>
      <button class="mobile-nav-item" :class="{'mobile-active': $route.path==='/products' }" @click="router.push('/products')">
        <UIcon name="bxs:category" class="w-5 h-5"/><span>محصولاتمون</span>
      </button>
      <button class="mobile-nav-item relative" @click="store?.changeStatusModal()">
        <UIcon name="material-symbols:shopping-cart-outline-rounded" class="w-5 h-5"/><span>سبدخرید</span>
        <UChip v-if="store?.allItem?.length" :text="store?.allItem?.length" size="sm" class="absolute top-1/2 -translate-y-5 translate-x-4" :ui="{background:'bg-mainColor text-secColor'}"/>
      </button>
      <button class="mobile-nav-item" @click="searchOpen = true">
        <UIcon name="material-symbols:search-rounded" class="w-5 h-5"/><span>جستجو</span>
      </button>
      <button v-if="!authUser" class="mobile-nav-item" @click="router.push('/auth/login')">
        <UIcon name="octicon:sign-in-16" class="w-5 h-5"/><span>ورود</span>
      </button>
      <button v-else class="mobile-nav-item" :class="{'mobile-active': $route.path.includes('profile')}" @click="router.push('/profile/')">
        <UIcon name="material-symbols:account-circle" class="w-5 h-5"/><span>پروفایل</span>
      </button>
    </div>
  </header>

  <USlideover v-model="searchOpen" side="bottom" :ui="{ base: 'z-[1000]', overlay: 'z-[990]', wrapper: 'z-[995]' }">
    <div dir="rtl" class="search-panel">
      <form @submit.prevent="submitSearch()" class="max-w-2xl mx-auto">
        <label for="site-search" class="search-label">جستجوی اسلیپر پاز</label>
        <div class="flex gap-2">
          <UInput id="site-search" v-model="searchTerm" autofocus icon="material-symbols:search" placeholder="مثلاً اسلیپر، دمپایی یا کفش راحتی" class="flex-1" />
          <button type="submit" class="aqua-cta px-5">جستجو</button>
        </div>
        <div v-if="searchSuggestions.length" class="mt-3 flex flex-wrap gap-2">
          <button v-for="suggestion in searchSuggestions" :key="suggestion" type="button" class="suggestion" @click="submitSearch(suggestion)">{{ suggestion }}</button>
        </div>
      </form>
    </div>
  </USlideover>

  <USlideover v-model="store.isOpenModal" class="flex flex-col flex-1" :ui="{ base: 'z-[950]', overlay: 'z-[940]', wrapper: 'z-[945]', body: { base: 'flex-1 bg-[#071b24]' }, ring: '', divide: 'divide-y divide-mainColor/10' }">
    <ProductCart preview />
  </USlideover>
</template>

<style>
.header { @apply relative lg:fixed top-0 w-full py-3 px-2 z-[800] isolate; }
.header-scroll { @apply relative fixed top-0 w-full py-2 px-2 z-[800] isolate; }
.header-block { @apply relative block w-full py-3 px-2 z-[800] isolate; }
.nav-shell { @apply relative z-[801] mx-auto max-w-7xl min-h-[64px] rounded-[24px] px-3 sm:px-5 flex items-center gap-4; }
.logo-wrap { @apply shrink-0 rounded-2xl px-2 py-1 transition-transform duration-300 hover:scale-105; }
.nav-link { @apply px-4 py-2 rounded-full text-sm text-white/70 transition-all duration-300 hover:text-white hover:bg-white/10; }
.nav-link-active { @apply text-mainColor bg-mainColor/10 shadow-[0_0_22px_rgba(255,190,51,.14)]; }
.icon-action { @apply w-10 h-10 items-center justify-center rounded-full text-white/80 bg-white/[.06] border border-white/10 transition hover:bg-mainColor/15 hover:text-mainColor; }
.aqua-cta { @apply inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-bold text-secColor bg-mainColor shadow-[0_0_24px_rgba(255,190,51,.20)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(255,190,51,.34)]; }
.aqua-cta-active { @apply ring-2 ring-mainColor/30; }
.mobile-nav { @apply md:hidden fixed bottom-3 left-2 right-2 z-[850] mx-auto max-w-xl rounded-[26px] px-2 py-2 flex justify-around border border-mainColor/15 bg-slate-950/90 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,.08),0_18px_60px_rgba(0,0,0,.22),0_0_45px_rgba(255,190,51,.06)]; }
.mobile-nav-item { @apply relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] text-white/60 transition-all hover:text-white; }
.mobile-active { @apply text-mainColor bg-mainColor/10; }
.search-panel { @apply relative z-[1001] min-h-48 p-6 text-white; background: linear-gradient(150deg,#1c1b22,#302b21); }
.search-label { @apply block text-sm font-bold text-mainColor mb-3; }
.suggestion { @apply px-3 py-1.5 rounded-full bg-white/10 border border-mainColor/15 text-sm text-white/80 hover:bg-mainColor/15 hover:text-mainColor transition; }

@media (max-width: 639px) {
  .header, .header-scroll, .header-block { padding-left: .5rem; padding-right: .5rem; }
  .nav-shell { min-height: 58px; border-radius: 20px; gap: .35rem; }
  .nav-shell .logo-wrap img { width: 92px; }
  .nav-shell > div:last-child { gap: .3rem; }
  .nav-shell .aqua-cta { min-height: 38px; padding: 0 .65rem; }
}
</style>