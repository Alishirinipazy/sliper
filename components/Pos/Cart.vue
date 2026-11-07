<script setup lang="ts">
import {numberFormat} from '~/utils/helper'

// سبد فروش + پرداخت با کارتخوان + رسید
const emit = defineEmits<{ (e: 'sold'): void; (e: 'unauthorized'): void }>()
const pos = usePos()
const toast = useToast()

const payOpen = ref(false)
const paying = ref(false)
const error = ref('')
const reference = ref('')
const clientKey = ref('')
const receipt = ref<any>(null)

const rial = computed(() => pos.total.value * 10)
const phoneOk = computed(() => !pos.phone.value || /^09\d{9}$/.test(pos.phone.value))

function newKey() {
  try { return crypto.randomUUID() } catch { return `k${Date.now()}${Math.random().toString(36).slice(2, 10)}` }
}

function startPay() {
  if (!pos.lines.value.length || !phoneOk.value) return
  error.value = ''
  reference.value = ''
  clientKey.value = newKey() // یک فروش = یک کلید؛ دوبار زدن دکمه هیچ‌وقت دوبار نمی‌فروشه
  payOpen.value = true
}

async function confirmPaid() {
  if (paying.value) return
  paying.value = true
  error.value = ''
  try {
    const data = await $fetch<any>('/api/pos/checkout', {
      method: 'POST',
      body: {
        client_key: clientKey.value,
        items: pos.lines.value.map(l => ({product_id: l.product_id, color_id: l.color_id, size_id: l.size_id, quantity: l.quantity})),
        expected_total: pos.total.value,
        discount: pos.safeDiscount.value,
        reference: reference.value.trim() || null,
        customer_phone: pos.phone.value || null,
      },
    })
    receipt.value = data
    payOpen.value = false
    pos.clear()
    emit('sold')
  } catch (e: any) {
    if (e?.statusCode === 401 || e?.status === 401) { payOpen.value = false; emit('unauthorized'); return }
    error.value = e?.data?.statusMessage || e?.statusMessage || 'ثبت فروش انجام نشد؛ دوباره امتحان کن'
    if (e?.statusCode === 409 || e?.status === 409) toast.add({title: 'مبلغ یا موجودی تغییر کرده', color: 'red'})
  } finally {
    paying.value = false
  }
}

function printReceipt() {
  if (import.meta.client) window.print()
}

function fmtTime(iso: string | null) {
  if (!iso) return ''
  return new Date(iso.endsWith('Z') ? iso : iso + 'Z').toLocaleString('fa-IR', {dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Tehran'})
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="flex items-center justify-between px-4 pt-4">
      <h2 class="text-base font-black text-secColor">سبد فروش</h2>
      <button v-if="pos.lines.value.length" type="button" class="text-xs text-cosColor hover:underline" @click="pos.clear()">خالی کردن</button>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3">
      <div v-if="!pos.lines.value.length" class="grid h-full place-items-center text-center text-sm text-gray-400">
        <div>
          <UIcon name="material-symbols:shopping-bag-outline" class="mx-auto mb-2 h-10 w-10"/>
          محصول رو از لیست انتخاب کن
        </div>
      </div>

      <TransitionGroup v-else name="line" tag="ul" class="space-y-2.5">
        <li v-for="l in pos.lines.value" :key="l.key" class="flex items-center gap-3 rounded-2xl bg-gray-50 p-2">
          <img :src="l.image" :alt="l.name" class="h-14 w-14 shrink-0 rounded-xl bg-white object-cover">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-bold text-secColor">{{ l.name }}</p>
            <p class="truncate text-xs text-gray-500">
              <template v-if="l.color">{{ l.color }}</template><template v-if="l.size"> · سایز {{ l.size }}</template>
            </p>
            <p class="text-xs font-bold text-secColor">{{ numberFormat(l.unit * l.quantity) }} تومان</p>
          </div>
          <div class="mini-stepper">
            <button type="button" aria-label="بیشتر" :disabled="l.quantity >= l.max" @click="pos.setQty(l.key, l.quantity + 1)">+</button>
            <span>{{ l.quantity }}</span>
            <button type="button" :aria-label="l.quantity === 1 ? 'حذف' : 'کمتر'" @click="pos.setQty(l.key, l.quantity - 1)">
              {{ l.quantity === 1 ? '×' : '−' }}
            </button>
          </div>
        </li>
      </TransitionGroup>
    </div>

    <div class="space-y-3 border-t border-gray-100 p-4">
      <div class="grid grid-cols-2 gap-2">
        <label class="block">
          <span class="mb-1 block text-[11px] text-gray-500">تخفیف (تومان)</span>
          <input v-model.number="pos.discount.value" type="number" min="0" inputmode="numeric" class="field" placeholder="۰">
        </label>
        <label class="block">
          <span class="mb-1 block text-[11px] text-gray-500">موبایل مشتری (اختیاری)</span>
          <input v-model="pos.phone.value" type="tel" inputmode="numeric" maxlength="11" class="field" :class="{'field-bad': !phoneOk}" placeholder="09…">
        </label>
      </div>

      <dl class="space-y-1 text-sm">
        <div class="flex justify-between text-gray-500"><dt>جمع کالاها ({{ pos.itemCount.value }})</dt><dd>{{ numberFormat(pos.subtotal.value) }}</dd></div>
        <div v-if="pos.safeDiscount.value" class="flex justify-between text-cosColor"><dt>تخفیف</dt><dd>− {{ numberFormat(pos.safeDiscount.value) }}</dd></div>
        <div class="flex items-baseline justify-between border-t border-dashed border-gray-200 pt-2 text-secColor">
          <dt class="font-bold">مبلغ قابل پرداخت</dt>
          <dd class="text-xl font-black">{{ numberFormat(pos.total.value) }} <small class="text-xs font-normal">تومان</small></dd>
        </div>
      </dl>

      <UButton block size="xl" color="yellow" class="rounded-2xl font-extrabold" icon="material-symbols:credit-card-outline"
               :disabled="!pos.lines.value.length || !phoneOk" @click="startPay">
        پرداخت با کارتخوان
      </UButton>
    </div>

    <!-- مرحله‌ی کارتخوان -->
    <UModal v-model="payOpen" prevent-close :ui="{width: 'sm:max-w-md', container: 'items-end sm:items-center'}">
      <div class="p-5 text-center" dir="rtl">
        <p class="text-sm text-gray-500">مبلغ رو روی کارتخوان بزن</p>
        <p class="my-2 text-4xl font-black text-secColor" data-test="pay-amount">{{ pos.total.value.toLocaleString('fa-IR') }}</p>
        <p class="text-sm text-gray-500">تومان <span class="mx-1">·</span> {{ rial.toLocaleString('fa-IR') }} ریال</p>

        <div class="mx-auto mt-4 max-w-xs text-start">
          <label class="mb-1 block text-[11px] text-gray-500">شماره پیگیری رسید کارتخوان (اختیاری)</label>
          <input v-model="reference" type="text" inputmode="numeric" maxlength="32" class="field" placeholder="مثلاً ۴۸۲۱۰۹">
        </div>

        <p v-if="error" class="mt-3 rounded-xl bg-red-50 p-2 text-sm text-red-500" role="alert" data-test="pay-error">{{ error }}</p>

        <div class="mt-5 grid gap-2">
          <UButton block size="lg" color="green" class="rounded-2xl" icon="i-heroicons-check-circle" :loading="paying" @click="confirmPaid">
            پرداخت موفق بود، فروش رو ثبت کن
          </UButton>
          <UButton block variant="ghost" color="gray" class="rounded-2xl" :disabled="paying" @click="payOpen = false">انصراف (پرداخت نشد)</UButton>
        </div>
        <p class="mt-3 text-[11px] leading-5 text-gray-400">فقط وقتی کارتخوان «تراکنش موفق» رو نشون داد دکمهٔ سبز رو بزن.</p>
      </div>
    </UModal>

    <!-- رسید -->
    <UModal :model-value="!!receipt" prevent-close :ui="{width: 'sm:max-w-sm', container: 'items-end sm:items-center'}">
      <div v-if="receipt" class="p-4" dir="rtl">
        <div class="receipt" data-test="receipt">
          <p class="text-center text-base font-black">اسلیپر پاز</p>
          <p class="text-center text-[11px] text-gray-500">فاکتور فروش حضوری · شماره {{ receipt.id }}</p>
          <p class="mb-2 text-center text-[11px] text-gray-500">{{ fmtTime(receipt.created_at) }}</p>
          <table class="w-full text-xs">
            <tbody>
            <tr v-for="(i, n) in receipt.items" :key="n" class="border-t border-dashed border-gray-300 align-top">
              <td class="py-1">{{ i.name }}<span v-if="i.color || i.size" class="block text-[10px] text-gray-500">{{ i.color }}<template v-if="i.size"> · {{ i.size }}</template></span></td>
              <td class="px-1 py-1 text-center">×{{ i.quantity }}</td>
              <td class="py-1 text-left">{{ numberFormat(i.subtotal) }}</td>
            </tr>
            </tbody>
          </table>
          <div class="mt-2 space-y-0.5 border-t border-gray-400 pt-2 text-xs">
            <div class="flex justify-between"><span>جمع</span><span>{{ numberFormat(receipt.total_amount) }}</span></div>
            <div v-if="receipt.discount" class="flex justify-between"><span>تخفیف</span><span>{{ numberFormat(receipt.discount) }}</span></div>
            <div class="flex justify-between text-sm font-black"><span>پرداخت‌شده (کارتخوان)</span><span>{{ numberFormat(receipt.paying_amount) }} تومان</span></div>
            <div v-if="receipt.reference" class="flex justify-between text-[11px] text-gray-500"><span>پیگیری</span><span>{{ receipt.reference }}</span></div>
          </div>
          <p class="mt-3 text-center text-[11px] text-gray-500">ممنون از خریدتون 💛</p>
        </div>
        <div class="no-print mt-4 grid grid-cols-2 gap-2">
          <UButton block variant="soft" color="gray" class="rounded-2xl" icon="material-symbols:print-outline" @click="printReceipt">چاپ</UButton>
          <UButton block color="yellow" class="rounded-2xl" icon="material-symbols:add" @click="receipt = null">فروش جدید</UButton>
        </div>
      </div>
    </UModal>
  </div>
</template>

<style scoped>
.field {
  @apply w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-secColor outline-none transition focus:border-mainColor focus:bg-white;
}

.field-bad {
  @apply border-red-300 bg-red-50;
}

.mini-stepper {
  @apply flex flex-col items-center overflow-hidden rounded-xl border border-gray-200 bg-white;
}

.mini-stepper button {
  @apply h-7 w-8 text-base font-bold text-secColor transition hover:bg-gray-100 disabled:text-gray-300;
}

.mini-stepper span {
  @apply py-0.5 text-sm font-black;
}

.line-enter-active, .line-leave-active {
  transition: all .3s ease;
}

.line-enter-from, .line-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

.receipt {
  @apply rounded-2xl border border-dashed border-gray-300 bg-white p-4;
}
</style>

<style>
@media print {
  body * {
    visibility: hidden !important;
  }

  .receipt, .receipt * {
    visibility: visible !important;
  }

  .receipt {
    position: fixed;
    inset: 0 auto auto 0;
    width: 72mm;
    border: 0 !important;
    padding: 2mm !important;
  }

  .no-print {
    display: none !important;
  }
}
</style>
