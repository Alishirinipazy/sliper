<script setup>
import {useModalStore} from "~/stores/cart"

const props = defineProps({
  product: {type: Object, default: null}
})
const isOpen = ref(false)
const loading = ref(false)
const input = ref('')
const messagesEl = ref(null)
const cart = useModalStore()
const toast = useToast()

const messages = ref([
  {
    role: 'assistant',
    content: 'سلام! 👋 من پازی هستم.\nمی‌تونم تو انتخاب سایز و محصول کمکت کنم 👟',
    products: [],
  }
])

const quickReplies = [
  'سایز پام رو نمیدونم کمکم کن؟',
  'تفاوت سایز دمپایی و کفش؟',
  'برای پای عریض چه سایزی؟',
  'دمپایی بچگانه چه سایزی دارید؟',
]

function numberFormat(n) {
  return new Intl.NumberFormat('fa-IR').format(n ?? 0)
}

async function sendMessage(text = null) {
  const msg = text ?? input.value.trim()

  if (!msg || loading.value) return

  messages.value.push({role: 'user', content: msg})
  input.value = ''
  loading.value = true
  scrollToBottom()

  try {
    const result = await $fetch('/api/chat', {
      method: 'POST',
      body: {
        messages: messages.value.slice(-8).map(m => ({
          role: m.role, content: m.content
        })),
        productSlug: props.product?.slug ?? null,
      }
    })
    messages.value.push({
      role: 'assistant',
      content: result.reply,
      products: result.products ?? [],
    })

    if (result.cart_updated) {
      await cart.fetchFromServer()
      toast.add({title: 'سبد خریدت به‌روز شد 🛒', color: 'green'})
    }
  } catch {
    messages.value.push({
      role: 'assistant',
      content: 'متأسفم، مشکلی پیش اومد. دوباره امتحان کن 🙏',
      products: [],
    })
  } finally {
    loading.value = false
    scrollToBottom()
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value)
      messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

function onKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

function clearChat() {
  messages.value = [{
    role: 'assistant',
    content: 'سلام! 👋 چطور می‌تونم کمکت کنم؟',
    products: [],
  }]
}
</script>

<template>
  <div dir="rtl">

    <!-- دکمه -->
    <UTooltip text="شروع مجدد">
      <button @click="isOpen = !isOpen"
              class="fixed bottom-6 left-6 z-50 w-14 h-14 bg-secColor rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300">
        <Transition name="icon-swap" mode="out-in">
          <UIcon v-if="isOpen" key="close" name="i-heroicons-x-mark" class="w-6 h-6 text-mainColor"/>
          <div v-else key="open" class="relative">
            <UAvatar
                size="xl"
                src="/images/pazy.png"
                alt="پازی"
            />
            <span
                class="absolute -top-0 -right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-secColor animate-pulse"></span>
          </div>
        </Transition>
      </button>
    </UTooltip>
    <!-- پنجره چت -->
    <Transition name="chat-slide">

      <div v-if="isOpen"
           class="fixed bottom-24 left-6 z-50 w-[320px] lg:w-[380px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
           style="max-height:520px">

        <!-- هدر -->
        <div class="bg-secColor px-4 py-3 flex items-center gap-3 flex-shrink-0">

          <UAvatar
              size="lg"
              src="/images/pazy.png"
              alt="پازی"
          />

          <div class="flex-1">

            <p class="text-white font-bold text-sm">پازی،</p>
            <div class="flex items-center gap-1.5 py-1">
              <span class="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              <p v-if="!loading" class="text-white/60 text-xs">
                آنلاین</p>
              <p v-else class="text-white/60 text-xs">در حال نوشتن...</p>
            </div>
          </div>
          <UTooltip text="شروع مجدد">
            <button @click="clearChat"
                    class="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
              <UIcon name="i-heroicons-arrow-path" class="w-3.5 h-3.5 text-white/70"/>
            </button>
          </UTooltip>
        </div>

        <!-- بنر محصول -->
        <div v-if="product"
             class="bg-mainColor/15 px-4 py-2 flex items-center gap-2 flex-shrink-0 border-b border-mainColor/10">
          <img :src="product.primary_image" class="w-8 h-8 rounded-lg object-cover flex-shrink-0"/>
          <div class="min-w-0">
            <p class="text-xs font-bold text-secColor truncate">{{ product.name }}</p>
            <p class="text-[10px] text-gray-500">درباره این محصول سوال بپرس</p>
          </div>
        </div>

        <!-- پیام‌ها -->
        <div ref="messagesEl"
             class="flex-1 overflow-y-auto p-4 space-y-3"
             style="min-height:0">

          <div v-for="(msg, i) in messages" :key="i">
            <div class="flex gap-2"
                 :class="msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'">

              <div class="w-7 h-7 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0"
                   :class="msg.role === 'assistant' ? 'bg-secColor' : 'bg-mainColor'">
                <UIcon :name="msg.role === 'assistant' ? 'i-heroicons-sparkles' : 'i-heroicons-user'"
                       class="w-3.5 h-3.5"
                       :class="msg.role === 'assistant' ? 'text-mainColor' : 'text-secColor'"/>
              </div>

              <div class="max-w-[78%]">
                <div class="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                     :class="msg.role === 'user'
                       ? 'bg-secColor text-mainColor rounded-tl-sm'
                       : 'bg-gray-100 text-gray-800 rounded-tr-sm'">
                  {{ msg.content }}
                </div>
              </div>
            </div>

            <!-- کارت‌های محصول پیشنهادی -->
            <div v-if="msg.products?.length" class="flex gap-2 overflow-x-auto mt-2 mr-9 pb-1">
              <NuxtLink v-for="p in msg.products" :key="p.id" :to="`/products/${p.slug}`"
                        class="flex-shrink-0 w-28 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
                <img :src="p.image || '/images/preloader.png'" class="w-full h-20 object-cover"/>
                <div class="p-1.5">
                  <p class="text-[10px] font-bold text-secColor truncate">{{ p.name }}</p>
                  <p class="text-[10px] text-mainColor font-bold mt-0.5">{{ numberFormat(p.min_price) }} ت</p>
                  <p class="text-[9px] mt-0.5" :class="p.in_stock ? 'text-green-500' : 'text-red-400'">
                    {{ p.in_stock ? 'موجود' : 'ناموجود' }}
                  </p>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- تایپینگ -->
          <div v-if="loading" class="flex gap-2">
            <div class="w-7 h-7 rounded-xl bg-secColor flex items-center justify-center flex-shrink-0">
              <UIcon name="i-heroicons-sparkles" class="w-3.5 h-3.5 text-mainColor"/>
            </div>
            <div class="bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-3 flex items-center gap-1">
              <span v-for="n in 3" :key="n"
                    class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    :style="{ animationDelay: `${(n-1)*0.15}s` }">
              </span>
            </div>
          </div>
        </div>

        <!-- پیشنهادات سریع -->
        <div v-if="messages.length <= 2 && !loading"
             class="px-3 pb-2 flex gap-1.5 flex-wrap flex-shrink-0">
          <button v-for="q in quickReplies" :key="q"
                  @click="sendMessage(q)"
                  class="text-xs bg-gray-100 hover:bg-mainColor hover:text-secColor text-gray-600 px-2.5 py-1.5 rounded-xl transition-all border border-transparent hover:border-mainColor/30">
            {{ q }}
          </button>
        </div>

        <!-- ورودی -->
        <div class="px-3 pb-3 pt-2 border-t border-gray-100 flex-shrink-0">
          <div
              class="flex gap-2 items-end bg-gray-50 rounded-2xl px-3 py-2 border-2 border-transparent focus-within:border-mainColor transition-colors">
            <textarea v-model="input"
                      @keydown="onKeydown"
                      :disabled="loading"
                      rows="1"
                      placeholder="سوالت رو بنویس..."
                      class="flex-1 bg-transparent text-sm outline-none resize-none text-gray-800 placeholder:text-gray-400 max-h-20">
            </textarea>
            <button @click="sendMessage()"
                    :disabled="!input.trim() || loading"
                    class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                    :class="input.trim() && !loading
                      ? 'bg-secColor hover:opacity-80 active:scale-95'
                      : 'bg-gray-200 cursor-not-allowed'">
              <UIcon name="i-heroicons-paper-airplane"
                     class="w-4 h-4"
                     :class="input.trim() ? 'text-mainColor' : 'text-gray-400'"/>
            </button>
          </div>
          <p class="text-center text-[10px] text-gray-300 mt-1">
            Enter ارسال • Shift+Enter خط جدید
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.chat-slide-enter-active, .chat-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-slide-enter-from, .chat-slide-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
  transform-origin: bottom left;
}

.icon-swap-enter-active, .icon-swap-leave-active {
  transition: all 0.2s ease;
}

.icon-swap-enter-from, .icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(90deg);
}
</style>
