<script setup lang="ts">
import {numberFormat} from '~/utils/helper'
import {useModalStore} from '~/stores/cart'

// پنل انتخاب داخل چت: رنگ، سایز، افزودن به سبد و پروب مجازی برای محصولِ انتخاب‌شده
const props = defineProps<{ slug: string }>()
const emit = defineEmits<{
  (e: 'tryon', payload: { product: any; color: any | null }): void
  (e: 'close'): void
  (e: 'ready'): void
}>()

const cart = useModalStore()
const toast = useToast()

const product = ref<any>(null)
const loading = ref(true)
const failed = ref(false)
const color = ref<any>(null)
const size = ref<any>(null)
const adding = ref(false)

const hasVariants = computed(() => !!product.value?.has_variants && product.value?.colors?.length)
const sizes = computed(() => color.value?.sizes ?? [])
const unitPrice = computed(() => {
  if (!product.value) return 0
  if (product.value.on_sale) return product.value.final_price
  return size.value?.price ?? product.value.min_price ?? 0
})
const canAdd = computed(() => {
  if (!product.value || product.value.total_quantity <= 0) return false
  return hasVariants.value ? !!(color.value && size.value) : true
})
const hint = computed(() => {
  if (!hasVariants.value) return ''
  if (!color.value) return 'اول یه رنگ انتخاب کن'
  if (!size.value) return 'حالا سایزت رو انتخاب کن'
  return ''
})

async function load() {
  loading.value = true
  failed.value = false
  color.value = null
  size.value = null
  try {
    product.value = await $fetch('/api/chat/product', {query: {slug: props.slug}})
    const first = product.value.colors?.find((c: any) => c.sizes.some((s: any) => s.available))
    if (first && product.value.colors.length === 1) color.value = first // یک رنگ بیشتر نیست؛ خودکار انتخاب می‌شود
  } catch {
    failed.value = true
  } finally {
    loading.value = false
    nextTick(() => emit('ready')) // پنل بزرگ‌تر شد؛ والد دوباره اسکرول می‌کند تا کامل دیده شود
  }
}

watch(() => props.slug, load, {immediate: true})

function pickColor(c: any) {
  color.value = c
  size.value = null
}

async function addToCart() {
  if (!canAdd.value || adding.value) return
  adding.value = true
  const ok = await cart.addToCart(product.value, 1, color.value, size.value)
  adding.value = false
  toast.add(ok
      ? {title: 'به سبد خریدت اضافه شد 🛒', color: 'green'}
      : {title: 'اضافه کردن انجام نشد، دوباره امتحان کن', color: 'red'})
}
</script>

<template>
  <div class="detail pop-in">
    <div v-if="loading" class="space-y-2">
      <div class="shimmer h-4 w-1/2 rounded"></div>
      <div class="shimmer h-8 w-full rounded-xl"></div>
    </div>

    <div v-else-if="failed || !product" class="text-center text-xs text-gray-500">
      اطلاعات محصول بارگذاری نشد.
      <button class="font-bold text-secColor underline" @click="load">تلاش دوباره</button>
    </div>

    <template v-else>
      <div class="flex items-start gap-3">
        <img :src="color?.image || product.primary_image" :alt="product.name" class="h-16 w-16 shrink-0 rounded-xl bg-gray-100 object-cover transition-all">
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-black text-secColor">{{ product.name }}</p>
          <p class="text-sm font-black" :class="product.on_sale ? 'text-cosColor' : 'text-secColor'">
            {{ numberFormat(unitPrice) }} <small class="font-normal">تومان</small>
            <span v-if="product.on_sale" class="mr-1 text-xs font-normal text-gray-400 line-through">{{ numberFormat(product.regular_price) }}</span>
          </p>
        </div>
        <button type="button" class="rounded-full p-1 text-gray-400 hover:bg-gray-100" aria-label="بستن" @click="emit('close')">
          <UIcon name="i-heroicons-x-mark" class="h-4 w-4"/>
        </button>
      </div>

      <!-- رنگ‌ها -->
      <div v-if="hasVariants" class="mt-3">
        <p class="mb-1.5 text-[11px] text-gray-500">رنگ <span v-if="color" class="font-bold text-secColor">{{ color.name }}</span></p>
        <div class="flex flex-wrap gap-2">
          <button v-for="c in product.colors" :key="c.id" type="button" class="swatch"
                  :class="{'swatch-on': color?.id === c.id}" :title="c.name" :aria-label="`رنگ ${c.name}`"
                  :aria-pressed="color?.id === c.id" @click="pickColor(c)">
            <span class="block h-full w-full rounded-full border border-black/10" :style="{background: c.color_code}"></span>
          </button>
        </div>
      </div>

      <!-- سایزها -->
      <Transition name="fade-up">
        <div v-if="color" class="mt-3">
          <p class="mb-1.5 text-[11px] text-gray-500">سایز</p>
          <div class="flex flex-wrap gap-1.5">
            <button v-for="s in sizes" :key="s.id" type="button" class="size-chip" :disabled="!s.available"
                    :class="{'size-chip-on': size?.id === s.id}" @click="size = s">
              {{ s.size }}
            </button>
          </div>
        </div>
      </Transition>

      <p v-if="product.total_quantity <= 0" class="mt-3 text-xs text-red-500">این محصول فعلاً ناموجوده.</p>
      <p v-else-if="hint" class="mt-2 text-[11px] text-gray-400">{{ hint }}</p>

      <div class="mt-3 flex gap-2">
        <UButton class="flex-1 justify-center rounded-xl" color="yellow" icon="material-symbols:add-shopping-cart"
                 :disabled="!canAdd" :loading="adding" @click="addToCart">
          افزودن به سبد
        </UButton>
        <UButton class="rounded-xl" color="gray" variant="soft" icon="material-symbols:photo-camera-outline"
                 @click="emit('tryon', {product, color})">
          پرو مجازی
        </UButton>
        <UButton class="rounded-xl" color="gray" variant="ghost" icon="material-symbols:open-in-new" :to="`/products/${product.slug}`"
                 aria-label="صفحه محصول"/>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail {
  @apply mt-2 rounded-2xl border border-mainColor/40 bg-white p-3 shadow-lg;
}

.swatch {
  @apply h-8 w-8 rounded-full border-2 border-transparent p-[3px] transition duration-200 hover:scale-110;
}

.swatch-on {
  @apply scale-110 border-secColor;
}

.size-chip {
  @apply min-w-[2.4rem] rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-bold text-secColor transition duration-200 hover:border-mainColor active:scale-95 disabled:cursor-not-allowed disabled:text-gray-300 disabled:line-through;
}

.size-chip-on {
  @apply border-secColor bg-secColor text-mainColor;
}

.fade-up-enter-active, .fade-up-leave-active {
  transition: all .25s ease;
}

.fade-up-enter-from, .fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
