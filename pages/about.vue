<script setup>
useSeoMeta({
  title: 'درباره ما',
  description: 'داستان شکل‌گیری اسلیپر پـاز، ماموریت، چشم‌انداز و تیمی که با عشق این پلتفرم رو می‌سازن.',
})

const stats = [
  { value: '+1', label: 'محصول متنوع' },
  { value: '+0', label: 'مشتری راضی' },
  { value: '4', label: 'اعضای تیم' },
  { value: '1405', label: 'سال تاسیس' },
]

const missionPoints = [
  'انتخاب دقیق و کیفیت‌محور محصولات، از تولید تا بسته‌بندی',
  'قیمت‌گذاری منصفانه و شفاف، بدون هزینه‌ی پنهان',
  'تجربه‌ی خرید ساده و سریع، از سفارش تا درب خونه',
]

const visionPoints = [
  'تبدیل شدن به مرجع خرید آنلاین دمپایی و کفش راحتی در ایران',
  'گسترش تنوع محصولات با حفظ همون استاندارد کیفیت روز اول',
  'ساختن رابطه‌ای بلندمدت و مبتنی بر اعتماد با هر مشتری',
]

const historyHighlights = [
  'شروع ساده از دل یک پاساژ دمپایی‌فروشی',
  'ساخت سایت با عشق در زمستان ۱۴۰۳',
  'شکل‌گیری تیم در سال ۱۴۰۴',
  'رشد مستمر، قدم به قدم و با عشق',
]

const workSteps = [
  { icon: 'heroicons:magnifying-glass', title: 'انتخاب محصول', desc: 'بهترین دمپایی‌ها و کفش‌های راحتی رو با دقت از میان تولیدکننده‌های معتبر انتخاب می‌کنیم.' },
  { icon: 'heroicons:camera', title: 'عکاسی و ثبت', desc: 'هر محصول با عکس واقعی و توضیحات دقیق روی سایت قرار می‌گیره، بدون اغراق.' },
  { icon: 'heroicons:cube', title: 'بسته‌بندی با دقت', desc: 'سفارش‌ها با دقت و مراقبت بسته‌بندی می‌شن تا سالم دست شما برسن.' },
  { icon: 'heroicons:truck', title: 'ارسال سریع', desc: 'از لحظه‌ی ثبت سفارش تا تحویل درب منزل، در سریع‌ترین زمان ممکن.' },
]

const teams = [
  { icon: 'heroicons:paint-brush', title: 'طراحی و محتوا', desc: 'طراحی سایت و تولید محتوای هر محصول' },
  { icon: 'heroicons:chat-bubble-left-right', title: 'پشتیبانی مشتری', desc: 'پاسخگویی به سوالات و پیگیری سفارش‌ها' },
  { icon: 'heroicons:archive-box', title: 'بسته‌بندی و ارسال', desc: 'آماده‌سازی و ارسال دقیق سفارش‌ها' },
  { icon: 'heroicons:shield-check', title: 'کنترل کیفیت', desc: 'بررسی کیفیت محصولات پیش از ارسال' },
]

const whyUs = [
  { icon: 'heroicons:sparkles', title: 'کیفیت تضمینی', desc: 'هر محصول قبل از ارسال بررسی کیفیت می‌شه.' },
  { icon: 'heroicons:clock', title: 'ارسال سریع', desc: 'سفارش‌ها در کوتاه‌ترین زمان ممکن ارسال می‌شن.' },
  { icon: 'heroicons:currency-dollar', title: 'قیمت منصفانه', desc: 'بدون واسطه‌ی اضافه، مستقیم و شفاف.' },
  { icon: 'heroicons:heart', title: 'با عشق ساخته شده', desc: 'از انتخاب محصول تا بسته‌بندی، با عشق و دقت.' },
]
const links = [
  { label: 'خونه', to: '/' },
  { label: 'دربارمون' },

]
</script>

<template>
  <LayoutsHeader :fixed="true"/>

  <u-container class="py-8">

    <!-- بردکرامب -->
    <UBreadcrumb :links="links" dir="rtl" :ui="{ active: 'text-mainColor font-semibold', base: 'font-light text-gray-400' }"/>

    <!-- هیرو -->
    <div class="grid lg:grid-cols-2 gap-8 items-center mb-16">
      <div>
        <h1 class="text-3xl lg:text-4xl font-extrabold text-secColor leading-snug mb-4">
          ساختن با عشق، <span class="text-mainColor">قدم به قدم</span>
        </h1>
        <p class="text-gray-500 leading-8">
          ما به قدرت عشق به کار و تیمی بودن باور داریم. با دقت و صداقت، دمپایی و کفش راحتی رو انتخاب و
          به شما می‌رسونیم؛ چون هر قدمی که برمی‌دارید، برای ما مهمه.
        </p>
      </div>
      <div class="relative">
        <img src="/images/abote.png" alt="تیم اسلیپر پـ.ـاز" class="w-full rounded-3xl shadow-lg"/>
      </div>
    </div>

    <!-- آمار -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20 bg-secColor rounded-3xl p-8">
      <div v-for="s in stats" :key="s.label" class="text-center">
        <p class="text-2xl lg:text-3xl font-extrabold text-mainColor">{{ s.value }}</p>
        <p class="text-xs text-gray-300 mt-1">{{ s.label }}</p>
      </div>
    </div>

    <!-- ماموریت -->
    <div class="grid lg:grid-cols-2 gap-10 items-center mb-20">
      <img src="/images/men.webp" alt="ماموریت اسلیپر پـ.ـاز" class="w-full rounded-3xl order-2 lg:order-1"/>
      <div class="order-1 lg:order-2">
        <h2 class="text-2xl font-extrabold text-secColor mb-4">ماموریت ما</h2>
        <p class="text-gray-500 leading-8 mb-4">
          ماموریت ما ساده‌ست: خرید دمپایی و کفش راحتی رو برای شما آسون، مطمئن و لذت‌بخش کنیم.
        </p>
        <ul class="space-y-2">
          <li v-for="p in missionPoints" :key="p" class="flex items-start gap-2 text-sm text-gray-600">
            <UIcon name="heroicons:check-circle" class="text-mainColor w-5 h-5 flex-shrink-0 mt-0.5"/>
            {{ p }}
          </li>
        </ul>
      </div>
    </div>

    <!-- چشم‌انداز -->
    <div class="grid lg:grid-cols-2 gap-10 items-center mb-20">
      <div>
        <h2 class="text-2xl font-extrabold text-secColor mb-4">چشم‌انداز ما</h2>
        <p class="text-gray-500 leading-8 mb-4">
          چشم‌اندازمون اینه که اسلیپر پـ.ـاز رو به انتخاب اول هر کسی تبدیل کنیم که دنبال راحتی واقعیه.
        </p>
        <ul class="space-y-2">
          <li v-for="p in visionPoints" :key="p" class="flex items-start gap-2 text-sm text-gray-600">
            <UIcon name="heroicons:check-circle" class="text-mainColor w-5 h-5 flex-shrink-0 mt-0.5"/>
            {{ p }}
          </li>
        </ul>
      </div>
      <img src="/images/women.webp" alt="چشم‌انداز اسلیپر پـ.ـاز" class="w-full rounded-3xl"/>
    </div>

    <!-- داستان ما -->
    <div class="grid lg:grid-cols-2 gap-10 items-center mb-20">
      <img src="/images/child.webp" alt="داستان اسلیپر پـ.ـاز" class="w-full rounded-3xl order-2 lg:order-1"/>
      <div class="order-1 lg:order-2">
        <h2 class="text-2xl font-extrabold text-secColor mb-4">داستان ما</h2>
        <p class="text-gray-500 leading-8 mb-4 text-sm">
          تو سرمای زمستان سال ۱۴۰۲، به واسطه‌ی مدیر شرکتی که کار می‌کردم، وارد بازار بزرگ دمپایی شدم.
          توی یکی از غرفه‌های اون پاساژ، ادیت عکس‌های دمپایی‌ها رو انجام می‌دادم؛ همه‌جا دمپایی و صندل بود
          و خیلی برام لذت‌بخش بود که ببینم فرآیند تولید، حمل و فروش دمپایی به‌صورت آنلاین چقدر می‌تونه جذاب باشه.
          برای همین، توی زمستون ۱۴۰۳ سایتی رو با عشق ساختم و سال ۱۴۰۴ با عشق تیمی رو جمع کردیم تا این پلتفرم رو
          با ایده‌های جذاب راه بندازیم. از خرید و بسته‌بندی تا بارگذاری در سایت و ارسال تا درب خونه‌هاتون،
          <span class="text-mainColor font-bold"> با عشق زیر پاتیم</span>.
        </p>
        <ul class="space-y-2">
          <li v-for="h in historyHighlights" :key="h" class="flex items-start gap-2 text-sm text-gray-600">
            <UIcon name="heroicons:check-circle" class="text-mainColor w-5 h-5 flex-shrink-0 mt-0.5"/>
            {{ h }}
          </li>
        </ul>
      </div>
    </div>

    <!-- چطور کار می‌کنیم -->
    <div class="text-center mb-10">
      <h2 class="text-2xl font-extrabold text-secColor mb-2">چطور کار می‌کنیم</h2>
      <p class="text-gray-500 text-sm max-w-xl mx-auto">
        از انتخاب محصول تا رسیدن به دست شما، هر مرحله رو با دقت و شفافیت طی می‌کنیم.
      </p>
    </div>
    <div class="relative rounded-3xl overflow-hidden mb-8 h-64 lg:h-80">
      <img src="/images/img_2.png" alt="فرآیند کار اسلیپر پـ.ـاز" class="w-full h-full object-cover"/>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
      <div v-for="w in workSteps" :key="w.title" class="text-center p-4">
        <div class="w-12 h-12 rounded-2xl bg-mainColor/10 flex items-center justify-center mx-auto mb-3">
          <UIcon :name="w.icon" class="w-6 h-6 text-mainColor"/>
        </div>
        <p class="font-bold text-secColor text-sm mb-1">{{ w.title }}</p>
        <p class="text-xs text-gray-500 leading-6">{{ w.desc }}</p>
      </div>
    </div>

    <!-- تیم -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-extrabold text-secColor mb-2">ساختن با عشق، به‌عنوان یک تیم</h2>
        <p class="text-gray-500 text-sm max-w-xl">
          موفقیت ما نتیجه‌ی تلاش تیمیه که با هم، با عشق، این پلتفرم رو می‌سازن.
        </p>
      </div>
      <nuxt-link to="/products" class="hidden lg:block bg-mainColor text-secColor font-bold text-sm px-6 py-2.5 rounded-full hover:brightness-110 transition flex-shrink-0">
        مشاهده محصولات
      </nuxt-link>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
      <div v-for="t in teams" :key="t.title" class="bg-gray-50 rounded-2xl p-5 text-center hover:shadow-md transition">
        <div class="w-14 h-14 rounded-2xl bg-secColor flex items-center justify-center mx-auto mb-3">
          <UIcon :name="t.icon" class="w-7 h-7 text-mainColor"/>
        </div>
        <p class="font-bold text-secColor text-sm mb-1">{{ t.title }}</p>
        <p class="text-xs text-gray-500">{{ t.desc }}</p>
      </div>
    </div>

    <!-- چرا ما -->
    <div class="text-center mb-10">
      <h2 class="text-2xl font-extrabold text-secColor mb-2">چرا اسلیپر پـ.ـاز؟</h2>
      <p class="text-gray-500 text-sm max-w-xl mx-auto">
        دلایلی که مشتری‌های ما هر بار برمی‌گردن.
      </p>
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      <div v-for="w in whyUs" :key="w.title" class="text-center p-4 border border-gray-100 rounded-2xl">
        <div class="w-12 h-12 rounded-2xl bg-mainColor/10 flex items-center justify-center mx-auto mb-3">
          <UIcon :name="w.icon" class="w-6 h-6 text-mainColor"/>
        </div>
        <p class="font-bold text-secColor text-sm mb-1">{{ w.title }}</p>
        <p class="text-xs text-gray-500 leading-6">{{ w.desc }}</p>
      </div>
    </div>

  </u-container>

  <LayoutsFooter/>
</template>