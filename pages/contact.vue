<script setup lang="ts">
const toast = useToast()

const form = reactive({
  name: '',
  email: '',
  subject: '',
  text: '',
})
const loading = ref(false)
const errors = ref({})

function validate() {
  const e = {}
  if (!form.name.trim()) e.name = 'نام رو وارد کن'
  if (!form.email.trim()) e.email = 'ایمیل رو وارد کن'
  else if (!/^09\d{9}$/.test(form.email)) e.email = 'شماره همراه معتبر نیست'
  if (!form.subject.trim()) e.subject = 'موضوع رو وارد کن'
  if (!form.text.trim()) e.text = 'متن پیام رو وارد کن'
  errors.value = e
  return Object.keys(e).length === 0
}

async function submit() {
  if (!validate()) return
  loading.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body: form })
    toast.add({ title: 'پیام شما با موفقیت ارسال شد 🎉', color: 'green' })
    form.name = ''
    form.email = ''
    form.subject = ''
    form.text = ''
    errors.value = {}
  } catch (error) {
    toast.add({ title: 'ارسال پیام با خطا مواجه شد، دوباره امتحان کن', color: 'red' })
  } finally {
    loading.value = false
  }
}

useSeoMeta({
  title: 'تماس با اسلیپر پاز | ارتباط با ما',
  description: 'راه‌های ارتباط با اسلیپر پاز برای پیگیری سفارش، پرسش درباره محصولات و دریافت راهنمایی خرید.',
  ogTitle: 'تماس با اسلیپر پاز',
  ogDescription: 'برای پرسش درباره محصولات و سفارش‌ها با اسلیپر پاز در ارتباط باشید.',
  ogType: 'website',
  twitterCard: 'summary_large_image'
})
useHead({
  link: [{ rel: 'canonical', href: 'https://slipperpaz.ir/contact' }]
})
</script>

<template>
  <div dir="rtl">
    <LayoutsHeader :fixed="true"/>
    <UContainer  class=" py-6">

        <div class="relative bg-secColor rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl">

          <!-- بافت پس‌زمینه‌ی ظریف -->
          <div class="absolute inset-0 opacity-[0.04] pointer-events-none"
               style="background-image:radial-gradient(circle at 20% 20%, white 1px, transparent 1px);background-size:22px 22px;"/>

          <!-- شبکه‌های اجتماعی -->
          <div class="absolute top-5 left-5 md:top-8 md:left-8 z-20 flex gap-2">
            <a href="https://www.instagram.com/slipperpaz" target="_blank" rel="noopener"
               class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
              <UIcon name="simple-icons:instagram" class="w-4 h-4"/>
            </a>
            <a href="http://t.me/slipperpaz" target="_blank" rel="noopener"
               class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
              <UIcon name="simple-icons:telegram" class="w-4 h-4"/>
            </a>
            <a href="https://wa.link/t5isoi" target="_blank" rel="noopener"
               class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
              <UIcon name="simple-icons:whatsapp" class="w-4 h-4"/>
            </a>
          </div>

          <div class="relative z-10 flex flex-col lg:flex-row-reverse items-stretch">

            <!-- ستون راست: عکس داخل شکل ارگانیک -->
            <div class="hidden lg:flex lg:w-[42%] relative items-end justify-center pt-16">
              <div class="relative w-[85%] aspect-[4/5]">
                <div class="absolute inset-0 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] border-2 border-white/70"/>
                <div class="absolute inset-3 rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-mainColor overflow-hidden">
                  <img src="/images/women.webp" alt="پشتیبانی و ارتباط با اسلیپر پـ.ـاز"
                       class="w-full h-full object-cover mix-blend-luminosity opacity-90"/>
                </div>
              </div>
            </div>

            <!-- ردیف آیکون ناوبری کناری -->
            <div class="hidden md:flex flex-col gap-3 px-6 lg:px-8 py-10 justify-center">
              <nuxt-link to="/"
                         class="w-11 h-11 rounded-2xl bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
                <UIcon name="heroicons:home" class="w-5 h-5"/>
              </nuxt-link>
              <nuxt-link to="/contact"
                         class="w-11 h-11 rounded-2xl bg-mainColor text-secColor flex items-center justify-center transition">
                <UIcon name="heroicons:envelope" class="w-5 h-5"/>
              </nuxt-link>
              <nuxt-link to="/about"
                         class="w-11 h-11 rounded-2xl bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
                <UIcon name="heroicons:information-circle" class="w-5 h-5"/>
              </nuxt-link>
            </div>

            <!-- ستون فرم -->
            <div class="flex-1 px-6 md:px-10 lg:pl-4 py-10 md:py-14">
              <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-3">
                با <span class="text-mainColor">اسلیپر پاز </span>در تماس باش
              </h1>
              <p class="text-gray-400 text-sm md:text-base leading-7 max-w-md mb-8">
                برای پرسش درباره محصولات، وضعیت سفارش یا راهنمایی خرید، از راه‌های ارتباطی درج‌شده در فروشگاه با اسلیپر پاز در تماس باشید.
              </p>

              <form @submit.prevent="submit" class="max-w-md space-y-4">
                <div>
                  <label class="block text-xs text-gray-400 mb-1.5">اسم تون</label>
                  <input v-model="form.name" type="text" placeholder="داش علی"
                         class="w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-mainColor"
                         :class="errors.name ? 'border-red-500' : 'border-white/10'"/>
                  <p v-if="errors.name" class="text-xs text-red-400 mt-1">{{ errors.name }}</p>
                </div>

                <div>
                  <label class="block text-xs text-gray-400 mb-1.5">شماره تماس</label>
                  <input v-model="form.email" type="tel" placeholder="09928608594"
                         class="w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-mainColor"
                         :class="errors.email ? 'border-red-500' : 'border-white/10'"/>
                  <p v-if="errors.email" class="text-xs text-red-400 mt-1">{{ errors.email }}</p>
                </div>

                <div>
                  <label class="block text-xs text-gray-400 mb-1.5">موضوع</label>
                  <input v-model="form.subject" type="text" placeholder="موضوع پیام"
                         class="w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-mainColor"
                         :class="errors.subject ? 'border-red-500' : 'border-white/10'"/>
                  <p v-if="errors.subject" class="text-xs text-red-400 mt-1">{{ errors.subject }}</p>
                </div>

                <div>
                  <label class="block text-xs text-gray-400 mb-1.5">پیام شما</label>
                  <textarea v-model="form.text" rows="4" placeholder="متن پیامت رو اینجا بنویس..."
                            class="w-full bg-white/5 border rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 outline-none transition focus:border-mainColor resize-none"
                            :class="errors.text ? 'border-red-500' : 'border-white/10'"/>
                  <p v-if="errors.text" class="text-xs text-red-400 mt-1">{{ errors.text }}</p>
                </div>

                <button type="submit" :disabled="loading"
                        class="bg-mainColor text-secColor font-bold text-sm px-8 py-3 rounded-full hover:brightness-110 active:scale-95 transition disabled:opacity-60 flex items-center gap-2">
                  <span>{{ loading ? 'در حال ارسال...' : 'ارسال پیام' }}</span>
                  <div v-if="loading" class="w-4 h-4 border-2 border-secColor/40 border-t-secColor rounded-full animate-spin"/>
                </button>
              </form>
            </div>
          </div>
        </div>
    </UContainer>
    <LayoutsFooter />
  </div>
</template>
