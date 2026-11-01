<script setup lang="ts">
import {useModalStore} from '~/stores/cart'

// چت‌بات فروشگاه (پازی): نوار پایین صفحه + پنجره‌ی گفتگو.
// مشتری هر چیزی را بنویسد، محصولات مرتبط را به‌صورت کارت‌های انیمیشنی می‌بیند، رنگ/سایز را انتخاب می‌کند،
// به سبد اضافه می‌کند و با پروب مجازی عکس خودش را با محصول امتحان می‌کند.

type Product = Record<string, any>
type Message = { role: 'user' | 'assistant'; content: string; products?: Product[]; quick?: string[] }

const cart = useModalStore()
const toast = useToast()
const route = useRoute()

// محصولی که کاربر الان صفحه‌اش را می‌بیند (صفحه‌ی محصول آن را ست می‌کند)
const pageProduct = useState<Product | null>('chatProduct', () => null)
const homeMode = useState<'sale' | 'bestsellers'>('home-featured-mode', () => 'sale')

const isOpen = ref(false)
const loading = ref(false)
const input = ref('')
const dockInput = ref('')
const messagesEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const selected = ref<{ msg: number; id: number; slug: string } | null>(null)
const tryOn = ref<{ product: Product; color: Product | null } | null>(null)
const featuredLoaded = ref(false)

const welcome: Message = {
  role: 'assistant',
  content: 'سلام! 👋 من پازی‌ام.\nبگو دنبال چی می‌گردی تا بهترین گزینه‌ها رو نشونت بدم؛ می‌تونی عکس خودت رو هم بذاری و ببینی محصول بهت میاد یا نه 📸',
  products: [],
}
const messages = ref<Message[]>([{...welcome}])

const starters = ['دمپایی زنانه', 'دمپایی مردانه', 'دمپایی بچگانه', 'تخفیف‌دارها 🔥', 'پرفروش‌ها ⭐', 'سایزم رو نمی‌دونم']

const examples = [
  'دنبال چی می‌گردی؟',
  'مثلاً «دمپایی راحت زنانه زیر ۲۰۰ هزار»',
  'مثلاً «دمپایی بچگانه سایز ۳۰»',
  'مثلاً «ارزون‌ترین دمپایی تخفیف‌دار»',
]
const exampleIndex = ref(0)
let exampleTimer: ReturnType<typeof setInterval> | null = null

// در صفحاتی که کاربر وسط کار مهمی است (سبد، پرداخت، ورود، پروفایل) فقط دکمه‌ی گرد نمایش داده می‌شود
const compact = computed(() => ['/cart', '/profile', '/auth', '/payment'].some(p => route.path.startsWith(p)))

useHead({bodyAttrs: {class: computed(() => (compact.value ? '' : 'has-chat-dock'))}})

function numberFormat(n: number) {
  return new Intl.NumberFormat('fa-IR').format(n ?? 0)
}

function scrollToBottom(smooth = true) {
  nextTick(() => {
    const el = messagesEl.value
    if (el) el.scrollTo({top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto'})
  })
}

// ---------- باز و بسته کردن ----------
function openChat(text?: string) {
  if (!isOpen.value) {
    isOpen.value = true
    document.body.style.overflow = 'hidden'
    loadFeatured()
  }
  nextTick(() => inputEl.value?.focus())
  if (text?.trim()) sendMessage(text)
  dockInput.value = ''
}

function closeChat() {
  isOpen.value = false
  document.body.style.overflow = ''
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value && !tryOn.value) closeChat()
}

// پیشنهادهای امروز: همان لیستی که در صفحه‌ی اصلی اول نمایش داده شد (تخفیف‌ها یا پرفروش‌ها)
async function loadFeatured() {
  if (featuredLoaded.value) return
  featuredLoaded.value = true
  try {
    const data: any = await $fetch('/api/chat/featured')
    const useSale = homeMode.value === 'sale' && data.sale?.length
    const list = (useSale ? data.sale : data.bestsellers?.length ? data.bestsellers : data.newest) ?? []
    if (!list.length) return
    messages.value.push({
      role: 'assistant',
      content: useSale ? 'این‌ها تخفیف‌های امروزه 🔥 روی هر کدوم بزنی انتخابش می‌کنی:' : 'این‌ها پرفروش‌ترین‌های ما هستن ⭐ روی هر کدوم بزنی انتخابش می‌کنی:',
      products: list.slice(0, 6).map((p: Product) => ({...p, image: p.primary_image, in_stock: p.total_quantity > 0})),
    })
    scrollToBottom(false)
  } catch {
    // پیشنهادهای اولیه اختیاری‌اند؛ گفتگو بدونشون هم کار می‌کنه
  }
}

// ---------- ارسال پیام ----------
async function sendMessage(text: string | null = null) {
  const msg = (text ?? input.value).trim()
  if (!msg || loading.value) return

  messages.value.forEach(m => (m.quick = []))
  messages.value.push({role: 'user', content: msg})
  input.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const result: any = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value
            .filter(m => m.content)
            .slice(-8)
            .map(m => ({role: m.role, content: m.content})),
        productSlug: pageProduct.value?.slug ?? null,
      },
    })
    messages.value.push({
      role: 'assistant',
      content: result.reply,
      products: result.products ?? [],
      quick: result.quick_replies ?? [],
    })

    if (result.cart_updated) {
      await cart.fetchFromServer()
      toast.add({title: 'سبد خریدت به‌روز شد 🛒', color: 'green'})
    }
  } catch {
    messages.value.push({role: 'assistant', content: 'متأسفم، مشکلی پیش اومد. دوباره امتحان کن 🙏', products: []})
  } finally {
    loading.value = false
    scrollToBottom()
    nextTick(() => inputEl.value?.focus())
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    sendMessage()
  }
}

function autoGrow() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 96) + 'px'
}

watch(input, () => nextTick(autoGrow))

function clearChat() {
  selected.value = null
  messages.value = [{...welcome}]
  featuredLoaded.value = false
  loadFeatured()
}

// ---------- انتخاب محصول و پروب ----------
function toggleSelect(msgIndex: number, p: Product) {
  selected.value = selected.value?.id === p.id && selected.value.msg === msgIndex ? null : {msg: msgIndex, id: p.id, slug: p.slug}
  if (selected.value) scrollToBottom()
}

function openTryOn(payload: { product: Product; color: Product | null }) {
  tryOn.value = payload
}

onMounted(() => {
  window.addEventListener('keydown', onKey)
  exampleTimer = setInterval(() => (exampleIndex.value = (exampleIndex.value + 1) % examples.length), 3800)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (exampleTimer) clearInterval(exampleTimer)
  document.body.style.overflow = ''
})
</script>

<template>
  <div dir="rtl">
    <!-- نوار پایین صفحه (طبق طرح: دایره‌ی پازی + نوار بلند) -->
    <Transition name="dock">
      <div v-if="!isOpen" class="dock" :class="{'dock-compact': compact}">
        <button type="button" class="dock-avatar" aria-label="چت با پازی" @click="openChat()">
          <UAvatar size="lg" src="/images/pazy.jpg" alt="پازی"/>
          <span class="absolute right-0 top-0 h-3 w-3 animate-pulse rounded-full border-2 border-white bg-green-400"></span>
        </button>

        <form v-if="!compact" class="dock-pill" @submit.prevent="openChat(dockInput)">
          <input v-model="dockInput" type="text" class="dock-input" :placeholder="examples[exampleIndex]"
                 aria-label="جستجو با چت‌بات" @focus="openChat()">
          <button type="submit" class="dock-send" aria-label="ارسال">
            <UIcon name="i-heroicons-paper-airplane" class="h-4 w-4"/>
          </button>
        </form>
      </div>
    </Transition>

    <!-- پنجره‌ی گفتگو -->
    <div v-if="isOpen" class="fixed inset-0 z-[55]">
      <div class="backdrop" @click="closeChat"></div>

      <section class="panel" role="dialog" aria-modal="true" aria-label="چت با پازی">
        <!-- هدر -->
        <header class="flex shrink-0 items-center gap-3 bg-secColor px-4 py-3">
          <UAvatar size="lg" src="/images/pazy.jpg" alt="پازی"/>
          <div class="flex-1">
            <p class="text-sm font-bold text-white">پازی، دستیار خرید</p>
            <p class="flex items-center gap-1.5 text-xs text-white/60">
              <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400"></span>
              {{ loading ? 'در حال نوشتن...' : 'آنلاین' }}
            </p>
          </div>
          <UTooltip text="شروع مجدد">
            <button type="button" class="head-btn" aria-label="شروع مجدد" @click="clearChat">
              <UIcon name="i-heroicons-arrow-path" class="h-4 w-4"/>
            </button>
          </UTooltip>
          <button type="button" class="head-btn" aria-label="بستن" @click="closeChat">
            <UIcon name="i-heroicons-x-mark" class="h-5 w-5"/>
          </button>
        </header>

        <!-- محصولی که الان صفحه‌اش باز است -->
        <div v-if="pageProduct" class="flex shrink-0 items-center gap-2 border-b border-mainColor/20 bg-mainColor/15 px-4 py-2">
          <img :src="pageProduct.primary_image" :alt="pageProduct.name" class="h-9 w-9 shrink-0 rounded-lg object-cover">
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-bold text-secColor">{{ pageProduct.name }}</p>
            <p class="text-[10px] text-gray-500">درباره‌ی این محصول سوال بپرس</p>
          </div>
          <UButton size="xs" color="white" icon="material-symbols:photo-camera-outline"
                   @click="openTryOn({product: pageProduct, color: null})">
            پرو مجازی
          </UButton>
        </div>

        <!-- پیام‌ها -->
        <div ref="messagesEl" class="min-h-0 flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4" aria-live="polite">
          <div v-for="(msg, i) in messages" :key="i">
            <div class="flex gap-2" :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'">
              <div class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl"
                   :class="msg.role === 'assistant' ? 'bg-secColor' : 'bg-mainColor'">
                <UIcon :name="msg.role === 'assistant' ? 'i-heroicons-sparkles' : 'i-heroicons-user'" class="h-3.5 w-3.5"
                       :class="msg.role === 'assistant' ? 'text-mainColor' : 'text-secColor'"/>
              </div>
              <div class="max-w-[82%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
                   :class="msg.role === 'user' ? 'rounded-tl-sm bg-secColor text-mainColor' : 'rounded-tr-sm bg-white text-gray-800 shadow-sm'">
                {{ msg.content }}
              </div>
            </div>

            <!-- کارت‌های محصول + پنل انتخاب -->
            <div v-if="msg.products?.length" class="mr-9 mt-2">
              <ChatProductPick :products="msg.products" :selected-id="selected?.msg === i ? selected.id : null"
                               @select="toggleSelect(i, $event)"/>
              <ChatProductDetail v-if="selected?.msg === i" :key="selected.slug" :slug="selected.slug"
                                 @tryon="openTryOn" @close="selected = null" @ready="scrollToBottom()"/>
            </div>

            <!-- پیشنهادهای سریع (فقط زیر آخرین پیام) -->
            <div v-if="i === messages.length - 1 && !loading && (msg.quick?.length || (i === 0 || (i === 1 && messages.length === 2)))"
                 class="mr-9 mt-2 flex flex-wrap gap-1.5">
              <button v-for="(q, qi) in (msg.quick?.length ? msg.quick : starters)" :key="q" type="button" class="chip pop-in"
                      :style="{'--i': qi * 60}" @click="sendMessage(q)">
                {{ q }}
              </button>
            </div>
          </div>

          <!-- نشانگر تایپ -->
          <div v-if="loading" class="flex gap-2">
            <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-secColor">
              <UIcon name="i-heroicons-sparkles" class="h-3.5 w-3.5 text-mainColor"/>
            </div>
            <div class="flex items-center gap-1 rounded-2xl rounded-tr-sm bg-white px-4 py-3 shadow-sm">
              <span v-for="n in 3" :key="n" class="h-2 w-2 animate-bounce rounded-full bg-gray-400" :style="{animationDelay: `${(n - 1) * 0.15}s`}"></span>
            </div>
          </div>
        </div>

        <!-- ورودی -->
        <footer class="shrink-0 border-t border-gray-100 bg-white px-3 pb-3 pt-2">
          <div class="flex items-end gap-2 rounded-2xl border-2 border-transparent bg-gray-100 px-3 py-2 transition-colors focus-within:border-mainColor">
            <textarea ref="inputEl" v-model="input" rows="1" :disabled="loading" placeholder="مثلاً: دمپایی راحت زنانه زیر ۲۰۰ هزار تومن"
                      class="max-h-24 flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                      @keydown="onKeydown"></textarea>
            <button type="button" :disabled="!input.trim() || loading" aria-label="ارسال" class="send-btn"
                    :class="input.trim() && !loading ? 'bg-secColor text-mainColor active:scale-95' : 'cursor-not-allowed bg-gray-200 text-gray-400'"
                    @click="sendMessage()">
              <UIcon name="i-heroicons-paper-airplane" class="h-4 w-4"/>
            </button>
          </div>
        </footer>
      </section>
    </div>

    <ChatTryOn v-if="tryOn" :product="tryOn.product" :color="tryOn.color" @close="tryOn = null"/>
  </div>
</template>

<style>
/* جا برای نوار پایین، تا روی محتوای آخر صفحه نیفتد */
body.has-chat-dock {
  padding-bottom: 5rem;
}
</style>

<style scoped>
.dock {
  @apply fixed inset-x-0 bottom-3 z-40 mx-auto flex w-[min(720px,calc(100%-24px))] items-center gap-2.5;
}

.dock-compact {
  @apply inset-x-auto bottom-4 left-4 mx-0 w-auto;
}

.dock-avatar {
  @apply relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secColor shadow-xl shadow-black/30 ring-2 ring-mainColor transition duration-300 hover:scale-110 active:scale-95;
  animation: float-soft 3s ease-in-out infinite;
}

.dock-pill {
  @apply flex h-14 flex-1 items-center gap-2 rounded-full bg-white/95 px-5 shadow-xl shadow-black/20 ring-1 ring-black/5 backdrop-blur transition duration-300 focus-within:ring-2 focus-within:ring-mainColor;
}

.dock-input {
  @apply min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400;
}

.dock-send {
  @apply flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secColor text-mainColor transition hover:scale-105 active:scale-95;
}

.panel {
  @apply absolute inset-x-0 bottom-0 flex h-[90dvh] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl lg:inset-x-auto lg:bottom-6 lg:left-1/2 lg:h-[min(740px,84vh)] lg:w-[640px] lg:-translate-x-1/2 lg:rounded-3xl;
  animation: panel-in .38s cubic-bezier(.22, 1, .36, 1) both;
}

.backdrop {
  @apply absolute inset-0 bg-black/45 backdrop-blur-[2px];
  animation: fade-in .25s ease both;
}

.head-btn {
  @apply flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20;
}

.chip {
  @apply rounded-xl border border-transparent bg-white px-2.5 py-1.5 text-xs text-gray-600 shadow-sm transition-all hover:border-mainColor/40 hover:bg-mainColor hover:text-secColor active:scale-95;
}

.send-btn {
  @apply flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all;
}

.dock-enter-active, .dock-leave-active {
  transition: all .25s ease;
}

.dock-enter-from, .dock-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(.96);
}

@keyframes panel-in {
  from {
    opacity: 0;
    transform: translateY(32px) scale(.97);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (min-width: 1024px) {
  @keyframes panel-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(32px) scale(.97);
    }
    to {
      opacity: 1;
      transform: translateX(-50%);
    }
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .dock-avatar, .panel {
    animation: none;
  }
}
</style>
