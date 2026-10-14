<script setup lang="ts">
import {numberFormat} from '~/utils/helper'

// کارت‌های محصولِ پیشنهادیِ چت‌بات: اسکرول افقی، ورود پله‌ای با انیمیشن، انتخاب با یک لمس
defineProps<{ products: any[]; selectedId: number | null }>()
const emit = defineEmits<{ (e: 'select', product: any): void }>()

function price(p: any) {
  return p.final_price ?? p.min_price ?? 0
}
</script>

<template>
  <div class="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-2 pt-1">
    <button v-for="(p, i) in products" :key="p.id" type="button" class="pick group pop-in snap-start"
            :class="{'pick-selected': selectedId === p.id, 'pick-dim': selectedId && selectedId !== p.id}"
            :style="{'--i': i * 90}" :aria-pressed="selectedId === p.id" @click="emit('select', p)">
      <span class="relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
        <img :src="p.image || '/images/preloader.png'" :alt="p.name" loading="lazy"
             class="h-full w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-110">
        <span v-if="p.on_sale && p.discount_percent" class="absolute right-1.5 top-1.5 rounded-full bg-cosColor px-1.5 text-[10px] font-bold text-white">
          {{ p.discount_percent }}٪
        </span>
        <span class="check" aria-hidden="true">
          <UIcon name="i-heroicons-check" class="h-3.5 w-3.5"/>
        </span>
      </span>

      <span class="mt-1.5 block truncate text-start text-xs font-bold text-secColor">{{ p.name }}</span>

      <span class="flex items-baseline gap-1.5">
        <span class="text-xs font-black" :class="p.on_sale ? 'text-cosColor' : 'text-secColor'">{{ numberFormat(price(p)) }} ت</span>
        <span v-if="p.on_sale" class="text-[10px] text-gray-400 line-through">{{ numberFormat(p.regular_price) }}</span>
      </span>

      <span class="mt-1 flex items-center gap-1">
        <span v-for="c in (p.colors || []).slice(0, 4)" :key="c.name" class="h-2.5 w-2.5 rounded-full border border-black/10"
              :style="{background: c.color_code}" :title="c.name"></span>
        <span class="mr-auto text-[10px]" :class="p.in_stock ? 'text-green-600' : 'text-red-400'">
          {{ p.in_stock ? 'موجود' : 'ناموجود' }}
        </span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.pick {
  @apply relative w-[138px] shrink-0 rounded-2xl border-2 border-transparent bg-white p-2 text-start shadow-md shadow-gray-300/60 transition duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-95;
}

.pick-selected {
  @apply -translate-y-1.5 border-mainColor shadow-xl shadow-mainColor/30;
}

.pick-dim {
  @apply opacity-60;
}

.check {
  @apply absolute left-1.5 top-1.5 flex h-5 w-5 scale-0 items-center justify-center rounded-full bg-mainColor text-secColor opacity-0 transition duration-300;
}

.pick-selected .check {
  @apply scale-100 opacity-100;
}
</style>
