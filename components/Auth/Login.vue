<script setup>
const toast = useToast()
const emit = defineEmits(['showCheckOtpForm'])
const router = useRouter()

const cellphone = ref(null)
const loading = ref(false)
const pattern = /^(\+98|0)?9\d{9}$/

async function login() {
  if (!cellphone.value) {
    toast.add({ title: 'شماره تلفنت رو که وارد نکردی؟' })
    return
  }
  if (!pattern.test(cellphone.value)) {
    toast.add({ title: 'شماره تلفنت رو درست حسابی وارد کن...' })
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { cellphone: cellphone.value }
    })

    toast.add({ title: `کد تایید به شماره ${cellphone.value} ارسال شد` })
    emit('showCheckOtpForm')
    router.push({
      path: '/auth/login',
      query: { cellphone: cellphone.value }
    })
  } catch (error) {
    toast.add({
      title: error?.data?.message || 'مشکلی پیش اومد، دوباره امتحان کن',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <div class="auth-glow auth-glow-one"></div>
    <div class="auth-glow auth-glow-two"></div>

    <div class="relative z-10 w-full flex flex-col items-center">
      <div class="logo-orb">
        <img src="/images/logo.avif" alt="اسلیپر پاز" class="auth-logo">
      </div>

      <p class="auth-title">ورود و ثبت نام</p>
      <p class="auth-description">شماره تماست رو بفرست تا یک کد تایید برات ارسال کنیم</p>

      <form @submit.prevent="login" class="mt-6 w-full">
        <label class="auth-label" for="cellphone">شماره موبایل</label>
        <input
          id="cellphone"
          v-model="cellphone"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          :disabled="loading"
          class="auth-input"
          placeholder="09100000000"
          dir="ltr"
        >

        <button
          type="submit"
          :disabled="loading"
          class="auth-submit"
        >
          <span
            v-if="loading"
            class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
          />
          {{ loading ? 'در حال ارسال...' : 'دریافت کد ورود' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-card {
  @apply relative w-full max-w-md overflow-hidden rounded-[30px] border border-mainColor/20 bg-slate-950/55 p-6 sm:p-9 text-white shadow-[0_30px_90px_rgba(0,0,0,.4)] backdrop-blur-2xl;
}

.auth-card::before {
  content: '';
  position: absolute;
  inset: 1px;
  border-radius: 29px;
  pointer-events: none;
  background: linear-gradient(135deg, rgba(255,255,255,.11), transparent 35%, rgba(255,190,51,.08));
}

.auth-glow {
  @apply absolute rounded-full blur-3xl pointer-events-none;
}

.auth-glow-one {
  @apply -right-20 -top-20 h-44 w-44 bg-mainColor/15;
}

.auth-glow-two {
  @apply -left-24 bottom-0 h-40 w-40 bg-mainColor/10;
}

.logo-orb {
  @apply flex h-24 w-24 items-center justify-center rounded-full border border-mainColor/25 bg-white/[.04] shadow-[0_0_35px_rgba(255,190,51,.12)];
}

.auth-logo {
  @apply h-16 w-16 object-contain;
}

.auth-title {
  @apply mt-5 text-xl sm:text-2xl font-black text-white;
}

.auth-description {
  @apply mt-2 max-w-sm text-center text-sm leading-7 text-white/65;
}

.auth-label {
  @apply mb-2 block text-right text-xs font-bold text-white/70;
}

.auth-input {
  @apply w-full rounded-2xl border-2 border-white/80 bg-white px-4 py-3 text-center text-base font-bold text-slate-900 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-mainColor focus:ring-4 focus:ring-mainColor/15 disabled:cursor-not-allowed disabled:opacity-60;
}

.auth-submit {
  @apply mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-mainColor py-3.5 text-sm font-black text-slate-950 shadow-[0_12px_30px_rgba(255,190,51,.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(255,190,51,.28)] disabled:cursor-not-allowed disabled:opacity-60;
}

@media (max-width: 640px) {
  .auth-card {
    @apply rounded-[26px] p-5;
  }
}
</style>
