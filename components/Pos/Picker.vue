<script setup lang="ts">
import {numberFormat} from '~/utils/helper'
import type {PosLine} from '~/composables/usePos'

// انتخاب رنگ، سایز و تعداد - روی همان صفحه، بدون رفتن به جای دیگه
const props = defineProps<{ product: any | null }>()
const emit = defineEmits<{ (e: 'close'): void; (e: 'add', line: Omit<PosLine, 'key'>): void }>()

const color = ref<any>(null)
const size = ref<any>(null)
const qty = ref(1)

const open = computed({
  get: () => !!props.product,
  set: (v) => { if (!v) emit('close') },
})

watch(() => props.product, (p) => {
  qty.value = 1
  size.value = null
  color.value = p && p.colors?.length === 1 ? p.colors[0] : null
})

const variants = computed(() => !!props.product?.has_variants)
const sizes = computed(() => color.value?.sizes ?? [])
const maxQty = computed(() => variants.value ? (size.value?.quantity ?? 0) : (props.product?.stock ?? 0))
const unit = computed(() => {
  const p = props.product
  if (!p) return 0
  if (p.on_sale) return p.final_price
  return variants.value ? (size.value?.price ?? p.final_price) : (p.price || p.final_price)
})
const ready = computed(() => variants.value ? !!(color.value && size.value && maxQty.value > 0) : maxQty.value > 0)
const hint = computed(() => {
  if (!variants.value) return ''
  if (!color.value) return 'اول رنگ رو انتخاب کن'
  if (!size.value) return 'حالا سایز رو انتخاب کن'
  return ''
})

function pickColor(c: any) {
  color.value = c
  size.value = null
  qty.value = 1
}

function pickSize(s: any) {
  if (s.quantity <= 0) return
  size.value = s
  qty.value = Math.min(qty.value, s.quantity)
}

function add() {
  if (!ready.value) return
  const p = props.product
  emit('add', {
    product_id: p.id,
    color_id: color.value?.id ?? null,
    size_id: size.value?.id ?? null,
    name: p.name,
    image: color.value?.image || p.image,
    color: color.value?.name ?? null,
    size: size.value?.size ?? null,
    unit: unit.value,
    max: maxQty.value,
    quantity: qty.value,
  })
}
</script>

<template>
  <UModal v-model="open" :ui="{width: 'sm:max-w-md', container: 'items-end sm:items-center'}">
    <div v-if="product" class="p-4" dir="rtl">
      <div class="flex gap-3">
        <img :src="color?.image || product.image" :alt="product.name" class="h-24 w-24 shrink-0 rounded-2xl bg-gray-50 object-cover transition-all">
        <div class="min-w-0 flex-1">
          <p class="text-base font-black text-secColor">{{ product.name }}</p>
          <p class="mt-1 text-lg font-black" :class="product.on_sale ? 'text-cosColor' : 'text-secColor'">
            {{ numberFormat(unit) }} <small class="text-xs font-normal">تومان</small>
          </p>
          <p v-if="product.on_sale" class="text-xs text-gray-400 line-through">{{ numberFormat(product.regular_price) }}</p>
        </div>
        <button type="button" class="h-8 w-8 rounded-full text-gray-400 hover:bg-gray-100" aria-label="بستن" @click="emit('close')">
          <UIcon name="i-heroicons-x-mark" class="h-5 w-5"/>
        </button>
      </div>

      <div v-if="variants" class="mt-4">
        <p class="mb-2 text-xs text-gray-500">رنگ <b v-if="color" class="text-secColor">{{ color.name }}</b></p>
        <div class="flex flex-wrap gap-2.5">
          <button v-for="c in product.colors" :key="c.id" type="button" class="swatch" :class="{'swatch-on': color?.id === c.id}"
                  :title="c.name" :aria-label="`رنگ ${c.name}`" :aria-pressed="color?.id === c.id" @click="pickColor(c)">
            <span class="block h-full w-full rounded-full border border-black/10" :style="{background: c.color_code}"></span>
          </button>
        </div>

        <Transition name="rise">
          <div v-if="color" class="mt-4">
            <p class="mb-2 text-xs text-gray-500">سایز</p>
            <div class="flex flex-wrap gap-2">
              <button v-for="s in sizes" :key="s.id" type="button" class="size" :disabled="s.quantity <= 0"
                      :class="{'size-on': size?.id === s.id}" @click="pickSize(s)">
                {{ s.size }}
                <small v-if="s.quantity > 0 && s.quantity <= 3" class="block text-[10px] font-normal opacity-70">{{ s.quantity }} عدد</small>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <div class="mt-5 flex items-center gap-3">
        <div class="stepper">
          <button type="button" :disabled="qty <= 1" aria-label="کمتر" @click="qty--">−</button>
          <span>{{ qty }}</span>
          <button type="button" :disabled="!ready || qty >= maxQty" aria-label="بیشتر" @click="qty++">+</button>
        </div>
        <UButton class="flex-1 justify-center rounded-2xl" size="lg" color="yellow" icon="material-symbols:add-shopping-cart"
                 :disabled="!ready" @click="add">
          افزودن به سبد
        </UButton>
      </div>
      <p v-if="hint" class="mt-2 text-center text-xs text-gray-400">{{ hint }}</p>
    </div>
  </UModal>
</template>

<style scoped>
.swatch {
  @apply h-10 w-10 rounded-full border-2 border-transparent p-[3px] transition duration-200 hover:scale-110;
}

.swatch-on {
  @apply scale-110 border-secColor;
}

.size {
  @apply min-w-[3rem] rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-bold text-secColor transition duration-200 hover:border-mainColor active:scale-95 disabled:cursor-not-allowed disabled:text-gray-300 disabled:line-through;
}

.size-on {
  @apply border-secColor bg-secColor text-mainColor;
}

.stepper {
  @apply flex items-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50;
}

.stepper button {
  @apply h-12 w-11 text-xl font-bold text-secColor transition hover:bg-gray-100 disabled:text-gray-300;
}

.stepper span {
  @apply w-8 text-center text-base font-black;
}

.rise-enter-active, .rise-leave-active {
  transition: all .25s ease;
}

.rise-enter-from, .rise-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
