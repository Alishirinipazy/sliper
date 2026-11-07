<script setup lang="ts">
import {numberFormat} from '~/utils/helper'

// فروش حضوری (کارتخوان) - به هیچ‌جای سایت لینک نشده؛ ورودش فقط با ایمیل/رمز ادمینه.
definePageMeta({layout: false})
useHead({
  title: 'فروش حضوری | اسلیپر پاز',
  meta: [{name: 'robots', content: 'noindex, nofollow'}, {name: 'theme-color', content: '#222831'}],
})

const pos = usePos()
const toast = useToast()

const authed = ref(false)
const checking = ref(true)
const loading = ref(false)
const sections = ref<any[]>([])
const loadError = ref('')
const q = ref('')
const activeId = ref<number | null>(null)
const picked = ref<any>(null)
const sheetOpen = ref(false)
const bump = ref(false)

const login = reactive({email: '', password: '', busy: false, error: ''})

const today = reactive({open: false, loading: false, data: null as any, error: ''})

function norm(s: string) {
  return (s || '').replace(/ي/g, 'ی').replace(/ك/g, 'ک').toLowerCase().trim()
}

const visibleSections = computed(() => {
  const term = norm(q.value)
  if (!term) return sections.value
  return sections.value
      .map(s => ({...s, products: s.products.filter((p: any) => norm(p.name).includes(term))}))
      .filter(s => s.products.length)
})

async function loadCatalog(silent = false) {
  if (!silent) loading.value = true
  loadError.value = ''
  try {
    const data = await $fetch<any>('/api/pos/catalog')
    sections.value = data.sections
    authed.value = true
  } catch (e: any) {
    if ((e?.statusCode || e?.status) === 401) authed.value = false
    else loadError.value = 'لیست محصولات بارگذاری نشد'
  } finally {
    loading.value = false
    checking.value = false
  }
}

async function doLogin() {
  login.busy = true
  login.error = ''
  try {
    await $fetch('/api/pos/login', {method: 'POST', body: {email: login.email, password: login.password}})
    login.password = ''
    await loadCatalog()
  } catch (e: any) {
    login.error = e?.data?.statusMessage || 'ورود انجام نشد'
  } finally {
    login.busy = false
  }
}

async function logout() {
  await $fetch('/api/pos/logout', {method: 'POST'}).catch(() => {})
  authed.value = false
  sections.value = []
}

function sessionExpired() {
  authed.value = false
  toast.add({title: 'نشست تمام شد، دوباره وارد شو', color: 'red'})
}

function onAdd(line: any) {
  pos.add(line)
  picked.value = null
  bump.value = true
  setTimeout(() => (bump.value = false), 400)
  // روی دسکتاپ سبد کنار صفحه دیده می‌شه؛ اعلان فقط روی موبایل (و نباید روی دکمه‌ی پرداخت بیفته)
  if (window.innerWidth < 1024) toast.add({title: `${line.name} به سبد اضافه شد ✓`, color: 'green', timeout: 1500})
}

async function onSold() {
  sheetOpen.value = false
  loadCatalog(true) // موجودی‌ها بعد از فروش تازه می‌شن
}

async function openToday() {
  today.open = true
  today.loading = true
  today.error = ''
  try {
    today.data = await $fetch('/api/pos/orders')
  } catch (e: any) {
    today.error = 'فروش‌های امروز بارگذاری نشد'
    if ((e?.statusCode || e?.status) === 401) { today.open = false; sessionExpired() }
  } finally {
    today.loading = false
  }
}

function fmtTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso.endsWith('Z') ? iso : iso + 'Z').toLocaleTimeString('fa-IR', {hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tehran'})
}

function jump(id: number) {
  q.value = ''
  nextTick(() => document.getElementById(`cat-${id}`)?.scrollIntoView({behavior: 'smooth', block: 'start'}))
}

let raf = 0

function onScroll() {
  if (raf) return
  raf = requestAnimationFrame(() => {
    raf = 0
    let current: number | null = null
    for (const s of visibleSections.value) {
      const el = document.getElementById(`cat-${s.id}`)
      if (el && el.getBoundingClientRect().top <= 150) current = s.id
    }
    activeId.value = current ?? visibleSections.value[0]?.id ?? null
  })
}

onMounted(() => {
  pos.restore()
  loadCatalog()
  window.addEventListener('scroll', onScroll, {passive: true})
})
onBeforeUnmount(() => {
  if (import.meta.client) window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="min-h-screen bg-slate-100 pb-28 lg:pb-0" dir="rtl">
    <!-- در حال بررسی نشست -->
    <div v-if="checking" class="grid min-h-screen place-items-center text-sm text-gray-400">در حال بارگذاری…</div>

    <!-- ورود -->
    <div v-else-if="!authed" class="grid min-h-screen place-items-center px-4">
      <form class="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl" @submit.prevent="doLogin">
        <p class="text-center text-lg font-black text-secColor">فروش حضوری</p>
        <p class="mb-5 text-center text-xs text-gray-400">ورود مخصوص فروشنده</p>
        <label class="mb-1 block text-xs text-gray-500">ایمیل</label>
        <input v-model="login.email" type="email" required autocomplete="username" class="field mb-3" dir="ltr" name="email">
        <label class="mb-1 block text-xs text-gray-500">رمز عبور</label>
        <input v-model="login.password" type="password" required autocomplete="current-password" class="field" dir="ltr" name="password">
        <p v-if="login.error" class="mt-3 rounded-xl bg-red-50 p-2 text-center text-sm text-red-500" role="alert">{{ login.error }}</p>
        <UButton type="submit" block size="lg" color="yellow" class="mt-5 rounded-2xl" :loading="login.busy">ورود</UButton>
      </form>
    </div>

    <template v-else>
      <!-- نوار بالا + دسته‌ها -->
      <div class="sticky top-0 z-30 bg-secColor text-white shadow-lg">
        <div class="mx-auto flex max-w-[1400px] items-center gap-2 px-3 py-2.5">
          <p class="hidden shrink-0 text-sm font-black text-mainColor sm:block">فروش حضوری</p>
          <div class="relative min-w-0 flex-1">
            <UIcon name="i-heroicons-magnifying-glass" class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"/>
            <input v-model="q" type="search" placeholder="جستجوی محصول…" class="w-full rounded-2xl bg-white/10 py-2 pl-3 pr-9 text-sm text-white placeholder-white/50 outline-none transition focus:bg-white/20" data-test="search">
          </div>
          <button type="button" class="top-btn" title="بروزرسانی موجودی" aria-label="بروزرسانی موجودی" @click="loadCatalog()">
            <UIcon name="material-symbols:refresh" class="h-5 w-5"/>
          </button>
          <button type="button" class="top-btn" data-test="today-btn" @click="openToday">
            <UIcon name="material-symbols:receipt-long-outline" class="h-5 w-5"/><span class="hidden sm:inline">فروش امروز</span>
          </button>
          <button type="button" class="top-btn" aria-label="خروج" @click="logout">
            <UIcon name="material-symbols:logout" class="h-5 w-5"/>
          </button>
        </div>
        <nav v-if="sections.length > 1" class="no-scrollbar mx-auto flex max-w-[1400px] gap-2 overflow-x-auto px-3 pb-2.5" aria-label="دسته‌بندی‌ها">
          <button v-for="s in visibleSections" :key="s.id" type="button" class="chip" :class="{'chip-on': activeId === s.id}" @click="jump(s.id)">
            {{ s.name }} <small class="opacity-60">{{ s.products.length }}</small>
          </button>
        </nav>
      </div>

      <div class="mx-auto max-w-[1400px] gap-4 px-3 py-4 lg:grid lg:grid-cols-[1fr_380px]">
        <!-- محصولات: همه‌چیز در یک صفحه، بخش‌بندی‌شده -->
        <main>
          <div v-if="loading" class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            <div v-for="n in 8" :key="n" class="shimmer aspect-[4/5] rounded-3xl"></div>
          </div>
          <p v-else-if="loadError" class="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-500">
            {{ loadError }} <button class="font-bold underline" @click="loadCatalog()">تلاش دوباره</button>
          </p>
          <p v-else-if="!visibleSections.length" class="py-16 text-center text-sm text-gray-400">محصولی پیدا نشد</p>

          <section v-for="s in visibleSections" :id="`cat-${s.id}`" :key="s.id" class="mb-8 scroll-mt-32 last:min-h-[75vh]">
            <h2 class="mb-3 flex items-center gap-2 text-base font-black text-secColor">
              <span class="h-5 w-1.5 rounded-full bg-mainColor"></span>{{ s.name }}
              <small class="font-normal text-gray-400">{{ s.products.length }} محصول</small>
            </h2>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              <PosCard v-for="(p, i) in s.products" :key="p.id" :product="p" :index="i" @pick="picked = $event"/>
            </div>
          </section>
        </main>

        <!-- سبد: روی دسکتاپ ستون کناری، روی موبایل صفحه‌ی کشویی از پایین (یک نمونه‌ی واحد) -->
        <aside class="cart-shell" :class="{'cart-open': sheetOpen}" data-test="cart">
          <button type="button" class="mx-auto mt-2 block h-1.5 w-12 rounded-full bg-gray-300 lg:hidden" aria-label="بستن سبد" @click="sheetOpen = false"></button>
          <PosCart @sold="onSold" @unauthorized="sessionExpired"/>
        </aside>
      </div>

      <!-- نوار سبد روی موبایل -->
      <div class="lg:hidden">
        <button v-if="pos.itemCount.value" type="button" class="cart-bar" :class="{'cart-bump': bump}" data-test="cart-bar" @click="sheetOpen = true">
          <span class="flex items-center gap-2">
            <UIcon name="material-symbols:shopping-bag-outline" class="h-6 w-6"/>
            <b>{{ pos.itemCount.value }}</b> کالا
          </span>
          <span class="font-black">{{ numberFormat(pos.total.value) }} تومان</span>
        </button>
      </div>
      <div v-if="sheetOpen" class="fixed inset-0 z-30 bg-black/40 lg:hidden" @click="sheetOpen = false"></div>

      <PosPicker :product="picked" @close="picked = null" @add="onAdd"/>

      <!-- فروش امروز -->
      <UModal v-model="today.open" :ui="{width: 'sm:max-w-lg', container: 'items-end sm:items-center'}">
        <div class="p-4" dir="rtl">
          <div class="mb-3 flex items-center justify-between">
            <p class="font-black text-secColor">فروش حضوری امروز</p>
            <button type="button" class="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100" aria-label="بستن" @click="today.open = false">
              <UIcon name="i-heroicons-x-mark" class="h-5 w-5"/>
            </button>
          </div>
          <p v-if="today.loading" class="py-8 text-center text-sm text-gray-400">در حال بارگذاری…</p>
          <p v-else-if="today.error" class="py-8 text-center text-sm text-red-500">{{ today.error }}</p>
          <template v-else-if="today.data">
            <div class="mb-3 grid grid-cols-2 gap-2 text-center">
              <div class="rounded-2xl bg-gray-50 p-3"><p class="text-[11px] text-gray-500">تعداد فاکتور</p><p class="text-xl font-black">{{ today.data.count.toLocaleString('fa-IR') }}</p></div>
              <div class="rounded-2xl bg-mainColor/20 p-3"><p class="text-[11px] text-gray-500">جمع دریافتی کارتخوان</p><p class="text-xl font-black" data-test="today-sum">{{ numberFormat(today.data.sum) }}</p></div>
            </div>
            <ul class="max-h-[50vh] space-y-2 overflow-y-auto">
              <li v-for="o in today.data.orders" :key="o.id" class="rounded-2xl border border-gray-100 p-3 text-sm">
                <div class="flex justify-between font-bold text-secColor">
                  <span>#{{ o.id }} · {{ fmtTime(o.created_at) }}</span><span>{{ numberFormat(o.paying_amount) }}</span>
                </div>
                <p class="mt-0.5 truncate text-xs text-gray-500">{{ o.items.map((i: any) => `${i.name}×${i.quantity}`).join('، ') }}</p>
              </li>
              <li v-if="!today.data.orders.length" class="py-6 text-center text-sm text-gray-400">هنوز فروشی ثبت نشده</li>
            </ul>
          </template>
        </div>
      </UModal>
    </template>
  </div>
</template>

<style scoped>
.field {
  @apply w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-secColor outline-none transition focus:border-mainColor focus:bg-white;
}

.top-btn {
  @apply flex h-10 shrink-0 items-center gap-1.5 rounded-2xl bg-white/10 px-3 text-sm text-white transition hover:bg-white/20 active:scale-95;
}

.chip {
  @apply shrink-0 rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white/85 transition hover:bg-white/20;
}

.chip-on {
  @apply bg-mainColor font-bold text-secColor hover:bg-mainColor;
}

.cart-shell {
  @apply fixed inset-x-0 bottom-0 z-40 flex max-h-[88vh] min-h-[60vh] translate-y-full flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300;
}

.cart-open {
  @apply translate-y-0;
}

@media (min-width: 1024px) {
  .cart-shell {
    @apply sticky top-[116px] z-10 h-[calc(100vh-132px)] max-h-none translate-y-0 rounded-3xl shadow-md shadow-gray-300/70;
  }
}

.cart-bar {
  @apply fixed inset-x-3 bottom-3 z-20 flex items-center justify-between rounded-2xl bg-secColor px-4 py-3.5 text-white shadow-xl transition active:scale-[.98];
}

.cart-bump {
  animation: bump .4s ease;
}

@keyframes bump {
  40% {
    transform: scale(1.04);
  }
}
</style>
