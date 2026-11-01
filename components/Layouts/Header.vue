<script setup lang="ts">
import {useModalStore} from '@/stores/cart'


const store = useModalStore()

const isOpen = ref(false)
const menuOpen = ref(false)
const route = useRoute()
const searchOpen = ref(false)
const searchTerm = ref('')
const router = useRouter()

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
const classHeader = ref('header');
const {authUser} = useAuth();
const props = defineProps(['fixed'])

// منوی همبرگری با هر تغییر مسیر بسته می‌شود
watch(() => route.fullPath, () => {
  menuOpen.value = false
})

const menuLinks = [
  {to: '/', label: 'خونه', icon: 'material-symbols:other-houses'},
  {to: '/products', label: 'محصولاتمون', icon: 'bxs:category'},
  {to: '/about', label: 'دربارمون', icon: 'material-symbols:info-outline'},
  {to: '/contact', label: 'تماس با ما', icon: 'material-symbols:call-outline'},
]

if (props?.fixed) {
  classHeader.value = "header-block"
} else {
  classHeader.value = "header"
  const onScroll = () => {
    classHeader.value = window.scrollY <= 200 ? "header" : "header-scroll"
  }
  onMounted(() => {
    window.addEventListener('scroll', onScroll, {passive: true})
    onScroll()
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
}

</script>
<template>
  <header class="transition-all text-cyan-50 duration-700 ease-in-out z-110" :class="classHeader">
    <u-container>
      <div class="flex justify-between lg:justify-around md:justify-around items-center w-full">

        <div class="w-1/3 flex justify-start lg:justify-center">
          <button type="button" class="hamburger lg:!hidden" aria-label="باز کردن منو" :aria-expanded="menuOpen"
                  @click="menuOpen = true">
            <span></span><span></span><span></span>
          </button>
          <ul class="hidden lg:flex">
            <li class="px-2" :class="{'text-amber-400': $route.path==='/'}">
              <nuxt-link to="/">
                خونه
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/products" :class="{'text-amber-400': $route.path==='/products'}">
                محصولاتمون
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/about" :class="{'text-amber-400': $route.path==='/about'}">
                دربارمون
              </nuxt-link>
            </li>
            <li class="px-2">
              <nuxt-link to="/contact" :class="{'text-amber-400': $route.path==='/contact'}">
                تماس با ما
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="w-1/3 flex justify-center">
          <nuxt-link to="/">
            <img src="/images/logo.avif" class="w-[130px]" alt="اسلیپر پاز">
          </nuxt-link>
        </div>
        <div class=" w-1/3 flex justify-end mx-1">
          <!---->

          <div>

            <UButton class="rounded-full mx-1" icon="material-symbols:shopping-cart" aria-label="سبد خرید" @click="store?.changeStatusModal()"
                     color="yellow">
              <UChip :text="store?.allItem?.length" v-if="store?.allItem?.length" size="lg" :ui="{background:'bg-secColor' ,}">
              </UChip>
            </UButton>
          </div>

          <nuxt-link to="/auth/login" v-if="!authUser">
            <UButton color="yellow" class="mx-2" :ui="{ rounded: 'rounded-full' }">
              <span class="hidden md:block">ثبت نام | ورود</span>
              <UIcon name="octicon:sign-in-16" class="w-5 h-5"/>
            </UButton>
          </nuxt-link>
          <nuxt-link to="/profile/" v-else :class="{'text-amber-400': $route.path.includes('profile')}">
            <UButton color="yellow" class="mx-2" :class="{'bg-cosColor': $route.path.includes('profile')  }"
                     :ui="{ rounded: 'rounded-full' }">
              <span class="hidden md:block">{{ authUser?.name }}</span>
              <UIcon name="material-symbols:account-circle" class="w-5 h-5"/>
            </UButton>
          </nuxt-link>
        </div>
      </div>
    </u-container>
  </header>

  <!-- منوی همبرگری موبایل -->
  <USlideover v-model="menuOpen" side="right" :ui="{ width: 'max-w-[290px]' }">
    <div dir="rtl" class="flex h-full flex-col bg-secColor text-cyan-50">
      <div class="flex items-center justify-between p-4">
        <img src="/images/logo.avif" class="w-[110px]" alt="اسلیپر پاز">
        <button type="button" class="rounded-full bg-white/10 p-2 transition hover:bg-white/20" aria-label="بستن منو"
                @click="menuOpen = false">
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5"/>
        </button>
      </div>

      <nav class="flex-1 space-y-1 px-3">
        <nuxt-link v-for="(link, i) in menuLinks" :key="link.to" :to="link.to" class="menu-link"
                   :class="{'menu-link-active': link.to === '/' ? $route.path === '/' : $route.path.startsWith(link.to)}"
                   :style="{'--i': i * 60}">
          <UIcon :name="link.icon" class="h-5 w-5"/>
          {{ link.label }}
        </nuxt-link>

        <button type="button" class="menu-link w-full" :style="{'--i': 240}"
                @click="menuOpen = false; store?.changeStatusModal()">
          <UIcon name="material-symbols:shopping-cart" class="h-5 w-5"/>
          سبد خرید
          <span v-if="store?.allItem?.length" class="mr-auto rounded-full bg-mainColor px-2 text-xs font-bold text-secColor">
            {{ store.allItem.length }}
          </span>
        </button>

        <nuxt-link v-if="!authUser" to="/auth/login" class="menu-link" :style="{'--i': 300}">
          <UIcon name="octicon:sign-in-16" class="h-5 w-5"/>
          ثبت نام | ورود
        </nuxt-link>
        <nuxt-link v-else to="/profile/" class="menu-link" :style="{'--i': 300}">
          <UIcon name="material-symbols:account-circle" class="h-5 w-5"/>
          {{ authUser?.name || 'پروفایل' }}
        </nuxt-link>
      </nav>

      <div class="flex justify-center gap-3 p-4">
        <a href="https://www.instagram.com/slipperpaz" target="_blank" rel="noopener" aria-label="اینستاگرام" class="menu-social">
          <UIcon name="simple-icons:instagram" class="h-4 w-4"/>
        </a>
        <a href="http://t.me/slipperpaz" target="_blank" rel="noopener" aria-label="تلگرام" class="menu-social">
          <UIcon name="simple-icons:telegram" class="h-4 w-4"/>
        </a>
        <a href="https://wa.link/t5isoi" target="_blank" rel="noopener" aria-label="واتساپ" class="menu-social">
          <UIcon name="simple-icons:whatsapp" class="h-4 w-4"/>
        </a>
      </div>
    </div>
  </USlideover>

  <USlideover v-model="searchOpen" side="top">
    <div dir="rtl" class="p-5 bg-white">
      <form @submit.prevent="submitSearch()" class="max-w-2xl mx-auto">
        <label for="site-search" class="block text-sm font-bold text-secColor mb-2">جستجوی اسلیپر پاز</label>
        <div class="flex gap-2">
          <UInput
              id="site-search"
              v-model="searchTerm"
              autofocus
              icon="material-symbols:search"
              placeholder="مثلاً اسلیپر، دمپایی یا کفش راحتی"
              class="flex-1"
          />
          <UButton type="submit" color="yellow" label="جستجو" />
        </div>

        <div v-if="searchSuggestions.length" class="mt-3 flex flex-wrap gap-2">
          <button
              v-for="suggestion in searchSuggestions"
              :key="suggestion"
              type="button"
              class="px-3 py-1.5 rounded-full bg-slate-100 text-sm text-secColor hover:bg-mainColor transition"
              @click="submitSearch(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </form>
    </div>
  </USlideover>

  <USlideover v-model="store.isOpenModal" class="flex flex-col flex-1"
              :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
    <ProductCart/>
  </USlideover>
</template>
<style>
.header {
  @apply sticky lg:fixed top-0 w-full z-20 py-2 bg-secColor
}

.header-scroll {
  @apply sticky lg:fixed top-0 w-full z-20 bg-secColor py-1
}

.hamburger {
  @apply flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full bg-white/10 transition hover:bg-white/20 active:scale-95
}

.hamburger span {
  @apply block h-[2px] w-5 rounded bg-cyan-50 transition-all
}

.hamburger span:nth-child(2) {
  @apply w-3 self-end mr-[10px]
}

.hamburger:hover span:nth-child(2) {
  @apply w-5 mr-0
}

.menu-link {
  @apply flex items-center gap-3 rounded-2xl px-4 py-3 text-base transition hover:bg-white/10;
  animation: menu-in .4s cubic-bezier(.22, 1, .36, 1) both;
  animation-delay: calc(var(--i, 0) * 1ms + 120ms);
}

.menu-link-active {
  @apply bg-white/10 text-amber-400
}

.menu-social {
  @apply flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-mainColor hover:text-secColor
}

@keyframes menu-in {
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.header-block {
  @apply block bg-secColor py-2
}
</style>