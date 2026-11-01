<script setup lang="ts">
// پروب مجازی: کاربر عکس خودش را درگ‌اند‌دراپ (یا انتخاب/گرفتن) می‌کند و می‌بیند محصول بهش می‌آید یا نه.
// حالت اصلی با هوش مصنوعی عکس می‌سازد؛ اگر سرویس در دسترس نبود، «حالت دستی» (جابه‌جا کردن محصول روی عکس) فعال می‌شود.
const props = defineProps<{ product: any; color: any | null }>()
const emit = defineEmits<{ (e: 'close'): void }>()

type Status = 'idle' | 'loading' | 'done' | 'error'

const selectedColor = ref<any>(props.color ?? null)
const photoBlob = ref<Blob | null>(null)
const photoUrl = ref('')
const resultUrl = ref('')
const status = ref<Status>('idle')
const errorMsg = ref('')
const dragging = ref(false)
const view = ref<'result' | 'original'>('result')
const mode = ref<'ai' | 'manual'>('ai')
const fileInput = ref<HTMLInputElement | null>(null)
const cameraInput = ref<HTMLInputElement | null>(null)

const productImage = computed(() => selectedColor.value?.image || props.product?.primary_image)

// ---------- انتخاب و کوچک‌کردن عکس (موبایل‌ها عکس‌های چندمگابایتی می‌دهند) ----------
async function shrink(file: File, max = 1280): Promise<Blob> {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(img.naturalWidth * scale)
    canvas.height = Math.round(img.naturalHeight * scale)
    canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
    return await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob'))), 'image/jpeg', 0.9))
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function setFile(file?: File | null) {
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'فقط فایل عکس قبوله (JPG یا PNG).'
    status.value = 'error'
    return
  }
  try {
    const blob = await shrink(file)
    if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
    photoBlob.value = blob
    photoUrl.value = URL.createObjectURL(blob)
    resultUrl.value = ''
    status.value = 'idle'
    errorMsg.value = ''
    view.value = 'result'
  } catch {
    errorMsg.value = 'این عکس باز نشد؛ یه عکس دیگه امتحان کن.'
    status.value = 'error'
  }
}

function onDrop(e: DragEvent) {
  dragging.value = false
  setFile(e.dataTransfer?.files?.[0])
}

function onPick(e: Event) {
  const input = e.target as HTMLInputElement
  setFile(input.files?.[0])
  input.value = ''
}

// ---------- ساخت عکس ----------
const waitingLines = ['دارم عکست رو آماده می‌کنم…', 'محصول رو روی عکست می‌ذارم…', 'نور و سایه رو تنظیم می‌کنم…', 'یه لحظه دیگه…']
const waitingIndex = ref(0)
let ticker: ReturnType<typeof setInterval> | null = null

async function generate() {
  if (!photoBlob.value || status.value === 'loading') return
  status.value = 'loading'
  errorMsg.value = ''
  waitingIndex.value = 0
  ticker = setInterval(() => (waitingIndex.value = (waitingIndex.value + 1) % waitingLines.length), 3500)

  const form = new FormData()
  form.append('product_slug', props.product.slug)
  if (selectedColor.value?.id) form.append('color_id', String(selectedColor.value.id))
  form.append('photo', photoBlob.value, 'photo.jpg')

  try {
    const data: any = await $fetch('/api/chat/tryon', {method: 'POST', body: form})
    resultUrl.value = data.image
    view.value = 'result'
    status.value = 'done'
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.statusMessage || 'ساخت عکس انجام نشد؛ دوباره امتحان کن.'
    status.value = 'error'
  } finally {
    if (ticker) clearInterval(ticker)
    ticker = null
  }
}

function reset() {
  status.value = 'idle'
  resultUrl.value = ''
  errorMsg.value = ''
  mode.value = 'ai'
}

// ---------- حالت دستی: جابه‌جا کردن محصول روی عکس ----------
const place = reactive({x: 50, y: 70, scale: 40, rotate: 0}) // درصد از عرض/ارتفاع، درصد عرض، درجه
const stageEl = ref<HTMLElement | null>(null)
let dragStart: { px: number; py: number; x: number; y: number } | null = null

function onPlaceDown(e: PointerEvent) {
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  dragStart = {px: e.clientX, py: e.clientY, x: place.x, y: place.y}
}

function onPlaceMove(e: PointerEvent) {
  if (!dragStart || !stageEl.value) return
  const r = stageEl.value.getBoundingClientRect()
  place.x = Math.min(100, Math.max(0, dragStart.x + ((e.clientX - dragStart.px) / r.width) * 100))
  place.y = Math.min(100, Math.max(0, dragStart.y + ((e.clientY - dragStart.py) / r.height) * 100))
}

function onPlaceUp() {
  dragStart = null
}

// ---------- چرخه‌ی عمر ----------
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  if (ticker) clearInterval(ticker)
  if (photoUrl.value) URL.revokeObjectURL(photoUrl.value)
})
</script>

<template>
  <Teleport to="body">
    <div class="tryon-backdrop" role="dialog" aria-modal="true" aria-label="پرو مجازی" @click.self="emit('close')">
      <div class="tryon-card" dir="rtl">
        <!-- هدر -->
        <div class="flex items-center gap-3 border-b border-gray-100 p-3">
          <img :src="productImage" :alt="product.name" class="h-12 w-12 rounded-xl bg-gray-100 object-cover">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-black text-secColor">پرو مجازی؛ {{ product.name }}</p>
            <div v-if="product.colors?.length > 1" class="mt-1 flex gap-1.5">
              <button v-for="c in product.colors" :key="c.id" type="button" class="h-5 w-5 rounded-full border-2 p-[2px] transition"
                      :class="selectedColor?.id === c.id ? 'border-secColor scale-110' : 'border-transparent'" :title="c.name"
                      @click="selectedColor = c; if (status === 'done') reset()">
                <span class="block h-full w-full rounded-full border border-black/10" :style="{background: c.color_code}"></span>
              </button>
            </div>
          </div>
          <button type="button" class="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="بستن" @click="emit('close')">
            <UIcon name="i-heroicons-x-mark" class="h-5 w-5"/>
          </button>
        </div>

        <div class="max-h-[75vh] overflow-y-auto p-4">
          <!-- ۱) آپلود عکس -->
          <div v-if="!photoUrl"
               class="dropzone" :class="{'dropzone-over': dragging}"
               @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="onDrop">
            <UIcon name="material-symbols:add-photo-alternate-outline" class="h-12 w-12 text-mainColor" :class="{'animate-bounce': dragging}"/>
            <p class="mt-2 text-sm font-bold text-secColor">عکس خودت رو اینجا بنداز</p>
            <p class="mt-1 text-xs text-gray-500">یا از دکمه‌های پایین انتخابش کن</p>
            <div class="mt-4 flex flex-wrap justify-center gap-2">
              <UButton color="yellow" icon="material-symbols:photo-library-outline" @click="fileInput?.click()">انتخاب از گالری</UButton>
              <UButton color="gray" variant="soft" icon="material-symbols:photo-camera-outline" @click="cameraInput?.click()">گرفتن عکس</UButton>
            </div>
            <p class="mt-4 text-[11px] leading-relaxed text-gray-400">
              عکسی بده که قسمت مربوط به محصول (مثلاً پاها) واضح دیده بشه.<br>
              عکست جایی ذخیره نمی‌شه.
            </p>
          </div>

          <!-- ۲) عکس انتخاب‌شده / نتیجه -->
          <template v-else>
            <!-- حالت دستی -->
            <div v-if="mode === 'manual'">
              <div ref="stageEl" class="stage" dir="ltr">
                <img :src="photoUrl" alt="عکس شما" class="h-full w-full select-none object-contain" draggable="false">
                <img :src="productImage" :alt="product.name" draggable="false"
                     class="placed" :style="{left: place.x + '%', top: place.y + '%', width: place.scale + '%', transform: `translate(-50%, -50%) rotate(${place.rotate}deg)`}"
                     @pointerdown.prevent="onPlaceDown" @pointermove="onPlaceMove" @pointerup="onPlaceUp" @pointercancel="onPlaceUp">
              </div>
              <p class="mt-2 text-center text-[11px] text-gray-500">محصول رو با انگشت یا موس بکش و جاش رو تنظیم کن (نمای تقریبی)</p>
              <div class="mt-2 grid grid-cols-2 gap-3 text-xs text-gray-600">
                <label>اندازه<input v-model.number="place.scale" type="range" min="10" max="90" class="w-full accent-yellow-500"></label>
                <label>چرخش<input v-model.number="place.rotate" type="range" min="-90" max="90" class="w-full accent-yellow-500"></label>
              </div>
              <UButton class="mt-3" block color="gray" variant="soft" @click="mode = 'ai'">برگشت به پروب هوشمند</UButton>
            </div>

            <!-- حالت هوشمند -->
            <div v-else>
              <div class="stage" :class="{'stage-loading': status === 'loading'}">
                <img :src="status === 'done' && view === 'result' ? resultUrl : photoUrl" alt="پیش‌نمایش"
                     class="h-full w-full object-contain transition duration-500" :class="{'blur-[2px] brightness-90': status === 'loading'}">
                <div v-if="status === 'loading'" class="scan" aria-hidden="true"></div>
                <div v-if="status === 'loading'" class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-center text-sm text-white">
                  {{ waitingLines[waitingIndex] }}
                </div>
              </div>

              <div v-if="status === 'done'" class="mt-3 flex justify-center">
                <div class="inline-flex rounded-full bg-gray-100 p-1 text-xs font-bold">
                  <button type="button" class="seg" :class="{'seg-on': view === 'result'}" @click="view = 'result'">نتیجه</button>
                  <button type="button" class="seg" :class="{'seg-on': view === 'original'}" @click="view = 'original'">عکس خودم</button>
                </div>
              </div>

              <div v-if="status === 'error'" class="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-600">
                {{ errorMsg }}
                <button type="button" class="mr-1 font-bold underline" @click="mode = 'manual'">حالت دستی (تقریبی)</button>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                <UButton v-if="status !== 'done'" class="flex-1 justify-center" color="yellow" size="lg" icon="material-symbols:auto-awesome"
                         :loading="status === 'loading'" @click="generate">
                  {{ status === 'error' ? 'دوباره امتحان کن' : 'ببین بهم میاد؟' }}
                </UButton>
                <template v-else>
                  <UButton class="flex-1 justify-center" color="yellow" icon="material-symbols:download" :href="resultUrl" download="slipperpaz-tryon.png" tag="a">
                    ذخیره عکس
                  </UButton>
                  <UButton color="gray" variant="soft" icon="material-symbols:refresh" @click="reset">دوباره</UButton>
                </template>
                <UButton color="gray" variant="ghost" icon="material-symbols:swap-horiz" :disabled="status === 'loading'" @click="photoUrl = ''; reset()">
                  عکس دیگه
                </UButton>
              </div>
            </div>
          </template>
        </div>

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onPick">
        <input ref="cameraInput" type="file" accept="image/*" capture="user" class="hidden" @change="onPick">
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.tryon-backdrop {
  @apply fixed inset-0 z-[80] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4;
  animation: fade-in .2s ease both;
}

.tryon-card {
  @apply w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl;
  animation: sheet-up .35s cubic-bezier(.22, 1, .36, 1) both;
}

.dropzone {
  @apply flex flex-col items-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center transition duration-200;
}

.dropzone-over {
  @apply scale-[1.02] border-mainColor bg-mainColor/10;
}

.stage {
  @apply relative aspect-square w-full touch-none overflow-hidden rounded-2xl bg-gray-100;
}

.placed {
  @apply absolute cursor-grab touch-none select-none mix-blend-multiply active:cursor-grabbing;
}

.scan {
  @apply absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-mainColor/40 to-transparent;
  animation: scan 1.8s ease-in-out infinite;
}

.seg {
  @apply rounded-full px-4 py-1 text-gray-500 transition;
}

.seg-on {
  @apply bg-secColor text-mainColor shadow;
}

@keyframes scan {
  0% {
    top: -35%;
  }
  100% {
    top: 100%;
  }
}

@keyframes sheet-up {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
}
</style>
