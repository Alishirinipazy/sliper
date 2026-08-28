<script setup>
import { useModalStore } from "~/stores/cart"

const toast = useToast()
const { authUser } = useAuth()
const cart = useModalStore()
const route = useRoute()
const backState = ref("")
const errorMSG = ref({})
const otpDigits = ref(['', '', '', '', '', ''])
const otpRefs = ref([])
const loading = ref(false)

const otp = computed(() => otpDigits.value.join(''))
const pattern = /^[0-9]{6}$/

function setOtpRef(el, index) {
  if (el) otpRefs.value[index] = el
}

function focusOtp(index) {
  nextTick(() => otpRefs.value[index]?.focus())
}

function onOtpInput(index, event) {
  const value = String(event.target.value || '').replace(/\D/g, '')
  otpDigits.value[index] = value.slice(-1)
  backState.value = ''

  if (otpDigits.value[index] && index < 5) {
    focusOtp(index + 1)
  }

  if (otp.value.length === 6) {
    nextTick(() => checkOTP())
  }
}

function onOtpKeydown(index, event) {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpDigits.value[index - 1] = ''
    focusOtp(index - 1)
  }
}

function onOtpPaste(event) {
  event.preventDefault()
  const pasted = String(event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (!pasted) return

  otpDigits.value = Array.from({ length: 6 }, (_, index) => pasted[index] || '')
  focusOtp(Math.min(pasted.length, 6) - 1)

  if (pasted.length === 6) {
    nextTick(() => checkOTP())
  }
}

async function checkOTP() {
  if (otp.value.length === 0) {
    toast.add({ title: "کد تایید رو وارد نکردییی😒" })
    focusOtp(0)
    return
  }

  if (!pattern.test(otp.value)) {
    toast.add({ title: "ساختار کد ناخواناست 🤔" })
    backState.value = 'otp-error'
    return
  }

  loading.value = true
  try {
    const data = await $fetch('/api/auth/checkOtp', {
      method: 'POST',
      body: { otp: otp.value }
    })

    toast.add({ title: "شما با موفقیت وارد حساب شده اید" })
    authUser.value = data
    backState.value = "otp-success"
    cart.migrateGuestCartToServer()

    setTimeout(() => navigateTo('/profile/'), 900)
  } catch (error) {
    errorMSG.value = Object.values(error?.data?.data?.message || {}).flat()
    toast.add({ title: `${errorMSG.value || 'کد تایید صحیح نیست'}` })
    backState.value = "otp-error"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-card">
    <div class="auth-glow auth-glow-one"></div>
    <div class="auth-glow auth-glow-two"></div>

    <div class="relative z-10 flex w-full flex-col items-center">
      <div class="logo-orb">
        <img src="/images/logo.avif" alt="اسلیپر پاز" class="auth-logo">
      </div>

      <p class="auth-title">تایید شماره موبایل</p>
      <p class="auth-description">
        کد ۶ رقمی ارسال‌شده به شماره
        <span class="text-mainColor font-bold" dir="ltr">{{ route?.query?.cellphone }}</span>
        را وارد کن
      </p>

      <form class="mt-7 w-full" @submit.prevent="checkOTP">
        <div class="otp-wrap" dir="ltr" @paste="onOtpPaste">
          <input
            v-for="(_, index) in otpDigits"
            :key="index"
            :ref="el => setOtpRef(el, index)"
            v-model="otpDigits[index]"
            maxlength="1"
            inputmode="numeric"
            autocomplete="one-time-code"
            aria-label="رقم کد تایید"
            class="otp-box"
            :class="backState"
            :disabled="loading"
            @input="onOtpInput(index, $event)"
            @keydown="onOtpKeydown(index, $event)"
          >
        </div>

        <p class="otp-hint">کد را به صورت خودکار بین کادرها جابه‌جا می‌کنیم</p>

        <button
          type="submit"
          class="auth-submit"
          :disabled="loading || otp.length !== 6"
        >
          <span
            v-if="loading"
            class="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"
          />
          {{ loading ? 'در حال بررسی...' : 'تایید و ورود' }}
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

.otp-wrap {
  @apply flex w-full items-center justify-center gap-2 sm:gap-3;
}

.otp-box {
  @apply h-12 w-10 sm:h-14 sm:w-12 rounded-2xl border-2 border-white/80 bg-white text-center text-lg sm:text-xl font-black text-slate-900 outline-none shadow-[0_8px_20px_rgba(0,0,0,.12)] transition-all duration-200 focus:-translate-y-1 focus:border-mainColor focus:ring-4 focus:ring-mainColor/15;
  direction: ltr;
}

.otp-box:not(:placeholder-shown) {
  animation: otpPop .25s ease-out;
}

.otp-box.otp-success {
  @apply border-green-500 bg-green-50;
}

.otp-box.otp-error {
  @apply border-red-500 bg-red-50;
  animation: otpShake .35s ease-in-out;
}

.otp-hint {
  @apply mt-3 text-center text-[11px] text-white/40;
}

.auth-submit {
  @apply mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-mainColor py-3.5 text-sm font-black text-slate-950 shadow-[0_12px_30px_rgba(255,190,51,.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(255,190,51,.28)] disabled:cursor-not-allowed disabled:opacity-45;
}

@keyframes otpPop {
  0% { transform: scale(.72) translateY(5px); opacity: .45; }
  70% { transform: scale(1.08) translateY(-1px); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes otpShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
}

@media (max-width: 380px) {
  .auth-card { @apply rounded-[24px] p-4; }
  .otp-wrap { @apply gap-1.5; }
  .otp-box { @apply h-11 w-9 rounded-xl; }
}

@media (prefers-reduced-motion: reduce) {
  .otp-box { animation: none !important; transition: none; }
}
</style>
