<script setup lang="ts">
import {z} from 'zod'
import type {FormSubmitEvent} from '#ui/types'

// ─── Data & State ───────────────────────────────────────────────────────────
const {data, refresh} = await useFetch('/api/profile/addressess', {
  headers: useRequestHeaders(['cookie'])
})

const toast = useToast()
const loading = ref(false)
const isOpenEdit = ref(false)
const isOpenCreate = ref(false)
const editingRow = ref<Record<string, any> | null>(null)

// ─── Zod Schema ─────────────────────────────────────────────────────────────
const addressSchema = z.object({
  title: z.string().min(1, 'عنوان نمی‌تواند خالی باشد'),
  cellphone: z.string().regex(/^(\+98|0)?9\d{9}$/, 'شماره تماس نامعتبر است'),
  postal_code: z.string().min(1, 'کد پستی نمی‌تواند خالی باشد'),
  province_id: z.coerce.number({invalid_type_error: 'استان را انتخاب کنید'}).min(1, 'استان را انتخاب کنید'),
  city_id: z.coerce.number({invalid_type_error: 'شهر را انتخاب کنید'}).min(1, 'شهر را انتخاب کنید'),
  address: z.string().min(5, 'آدرس باید حداقل ۵ کاراکتر باشد'),
})

type AddressSchema = z.output<typeof addressSchema>

// ─── Forms State ────────────────────────────────────────────────────────────
const editState = reactive<Partial<AddressSchema>>({
  title: '', cellphone: '', postal_code: '',
  province_id: undefined, city_id: undefined, address: ''
})

const createState = reactive<Partial<AddressSchema>>({
  title: '', cellphone: '', postal_code: '',
  province_id: undefined, city_id: undefined, address: ''
})

// ─── Table ──────────────────────────────────────────────────────────────────
const columns = [
  {key: 'id', label: '#', class: 'w-12'},
  {key: 'title', label: 'عنوان'},
  {key: 'cellphone', label: 'شماره تماس'},
  {key: 'postal_code', label: 'کد پستی'},
  {key: 'province', label: 'استان / شهر'},
  {key: 'address', label: 'آدرس'},
  {key: 'actions', label: '', class: 'w-14'},
]

const rows = computed(() =>
    (data.value?.addresses ?? []).map((item: any) => ({
      id: item.id,
      title: item.title,
      cellphone: item.cellphone,
      postal_code: item.postal_code,
      province: data?.value?.provinces?.find(i => i.id === item.province_id)?.name + ' / ' +  data?.value?.cities?.find(i => i.id === item.city_id)?.name,
      address: item.address,
      _raw: item,
    }))
)

// ─── Province / City helpers ─────────────────────────────────────────────────
const filteredCitiesEdit = computed(() =>
    (data.value?.cities ?? []).filter((c: any) => c.province_id == editState.province_id)
)
const filteredCitiesCreate = computed(() =>
    (data.value?.cities ?? []).filter((c: any) => c.province_id == createState.province_id)
)

watch(() => editState.province_id, () => {
  editState.city_id = undefined
})
watch(() => createState.province_id, () => {
  createState.city_id = undefined
})

// ─── Row Actions ─────────────────────────────────────────────────────────────
const rowActions = (row: any) => [[
  {
    label: 'ویرایش',
    icon: 'i-heroicons-pencil-square',
    click: () => openEdit(row._raw),
  },
  {
    label: 'حذف',
    icon: 'i-heroicons-trash',
    class: 'text-red-500 dark:text-red-400',
    click: () => deleteAddress(row.id),
  },
]]

function openEdit(item: any) {
  Object.assign(editState, {
    title: item.title,
    cellphone: item.cellphone,
    postal_code: item.postal_code,
    province_id: item.province_id,
    city_id: item.city_id,
    address: item.address,
  })
  editingRow.value = item
  isOpenEdit.value = true
}

// ─── API Calls ───────────────────────────────────────────────────────────────
async function deleteAddress(id: number) {
  try {
    await $fetch('/api/profile/addressess/delete', {method: 'POST', body: {address_id: id}})
    refresh()
    toast.add({title: 'آدرس با موفقیت حذف شد', icon: 'i-heroicons-check-circle', color: 'green'})
  } catch (e: any) {
    const msg = Object.values(e?.data?.data?.message ?? {}).flat().join(' ')
    toast.add({title: msg || 'خطایی رخ داد', icon: 'i-heroicons-x-circle', color: 'red'})
  }
}

async function onSubmitEdit(event: FormSubmitEvent<AddressSchema>) {
  try {
    loading.value = true
    await $fetch('/api/profile/addressess/edite', {
      method: 'POST',
      body: {...event.data, address_id: editingRow.value?.id},
    })
    toast.add({title: 'آدرس با موفقیت ویرایش شد', icon: 'i-heroicons-check-circle', color: 'green'})
    refresh()
    isOpenEdit.value = false
  } catch (e: any) {
    const msg = Object.values(e?.data?.data?.message ?? {}).flat().join(' ')
    toast.add({title: msg || 'خطایی رخ داد', icon: 'i-heroicons-x-circle', color: 'red'})
  } finally {
    loading.value = false
  }
}

async function onSubmitCreate(event: FormSubmitEvent<AddressSchema>) {
  try {
    loading.value = true
    await $fetch('/api/profile/addressess/create', {method: 'POST', body: event.data})
    toast.add({title: 'آدرس با موفقیت ایجاد شد', icon: 'i-heroicons-check-circle', color: 'green'})
    refresh()
    isOpenCreate.value = false
    Object.assign(createState, {
      title: '',
      cellphone: '',
      postal_code: '',
      province_id: undefined,
      city_id: undefined,
      address: ''
    })
  } catch (e: any) {
    const msg = Object.values(e?.data?.data?.message ?? {}).flat().join(' ')
    toast.add({title: msg || 'خطایی رخ داد', icon: 'i-heroicons-x-circle', color: 'red'})
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div dir="rtl" class="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">

    <!-- ── Page Card ────────────────────────────────────────────────────── -->
    <UCard
        class="shadow-sm"
        :ui="{
        header: { padding: 'px-6 py-5' },
        body:   { padding: 'p-0' },
      }"
    >
      <!-- Header -->
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-map-pin" class="text-primary-500 w-5 h-5"/>
              آدرس‌های من
            </h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              آدرس‌های تحویل سفارش‌هایت را اینجا مدیریت کن.
            </p>
          </div>
          <UButton
              icon="i-heroicons-plus"
              label="آدرس جدید"
              @click="isOpenCreate = true"
          />
        </div>
      </template>

      <!-- Table -->
      <UTable
          :rows="rows"
          :columns="columns"
          :empty-state="{
          icon: 'i-heroicons-map-pin',
          label: 'هنوز آدرسی ثبت نشده',
          description: 'با کلیک روی «آدرس جدید» اولین آدرست رو اضافه کن.',
        }"
          :ui="{
          th: { base: 'text-right text-xs font-semibold uppercase tracking-wider' },
          td: { base: 'text-right text-sm' },
        }"
      >
        <template #actions-data="{ row }">
          <UDropdown :items="rowActions(row)" :popper="{ placement: 'bottom-end' }">
            <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-ellipsis-horizontal"
                size="xs"
            />
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- ── Edit Modal ───────────────────────────────────────────────────── -->
    <UModal v-model="isOpenEdit" :ui="{ width: 'sm:max-w-2xl' }">
      <UCard
          :ui="{
          header: { padding: 'px-6 py-4' },
          body:   { padding: 'px-6 py-5' },
          footer: { padding: 'px-6 py-4' },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-pencil-square" class="w-5 h-5 text-primary-500"/>
              ویرایش آدرس
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" size="xs" @click="isOpenEdit = false"/>
          </div>
        </template>

        <UForm :schema="addressSchema" :state="editState" @submit="onSubmitEdit" class="space-y-4">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="عنوان آدرس" name="title" required>
              <UInput v-model="editState.title" placeholder="مثلاً: خانه، محل کار"/>
            </UFormGroup>

            <UFormGroup label="شماره تماس" name="cellphone" required>
              <UInput v-model="editState.cellphone" placeholder="09xxxxxxxxx" dir="ltr"/>
            </UFormGroup>

            <UFormGroup label="کد پستی" name="postal_code" required>
              <UInput v-model="editState.postal_code" placeholder="1234567890" dir="ltr"/>
            </UFormGroup>

            <ClientOnly>
              <UFormGroup label="استان" name="province_id" required>
                <USelect
                    v-model="editState.province_id"
                    :options="(data?.provinces ?? []).map((p: any) => ({ label: p.name, value: p.id }))"
                    placeholder="انتخاب استان"
                />
              </UFormGroup>

              <UFormGroup label="شهر" name="city_id" required>
                <USelect
                    v-model="editState.city_id"
                    :options="filteredCitiesEdit.map((c: any) => ({ label: c.name, value: c.id }))"
                    :disabled="!editState.province_id"
                    placeholder="انتخاب شهر"
                />
              </UFormGroup>
            </ClientOnly>
          </div>

          <UFormGroup label="آدرس کامل" name="address" required>
            <UTextarea v-model="editState.address" placeholder="خیابان، کوچه، پلاک، واحد..." :rows="3"/>
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-2">
            <UButton color="gray" variant="ghost" label="انصراف" @click="isOpenEdit = false"/>
            <UButton type="submit" :loading="loading" icon="i-heroicons-check" label="ذخیره تغییرات"/>
          </div>

        </UForm>
      </UCard>
    </UModal>

    <!-- ── Create Modal ─────────────────────────────────────────────────── -->
    <UModal v-model="isOpenCreate" :ui="{ width: 'sm:max-w-2xl' }">
      <UCard
          :ui="{
          header: { padding: 'px-6 py-4' },
          body:   { padding: 'px-6 py-5' },
          footer: { padding: 'px-6 py-4' },
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <UIcon name="i-heroicons-plus-circle" class="w-5 h-5 text-primary-500"/>
              افزودن آدرس جدید
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark" size="xs" @click="isOpenCreate = false"/>
          </div>
        </template>

        <UForm :schema="addressSchema" :state="createState" @submit="onSubmitCreate" class="space-y-4">

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <UFormGroup label="عنوان آدرس" name="title" required>
              <UInput v-model="createState.title" placeholder="مثلاً: خانه، محل کار"/>
            </UFormGroup>

            <UFormGroup label="شماره تماس" name="cellphone" required>
              <UInput v-model="createState.cellphone" placeholder="09xxxxxxxxx" dir="ltr"/>
            </UFormGroup>

            <UFormGroup label="کد پستی" name="postal_code" required>
              <UInput v-model="createState.postal_code" placeholder="1234567890" dir="ltr"/>
            </UFormGroup>

            <ClientOnly>
              <UFormGroup label="استان" name="province_id" required>
                <USelect
                    v-model="createState.province_id"
                    :options="(data?.provinces ?? []).map((p: any) => ({ label: p.name, value: p.id }))"
                    placeholder="انتخاب استان"
                />
              </UFormGroup>

              <UFormGroup label="شهر" name="city_id" required>
                <USelect
                    v-model="createState.city_id"
                    :options="filteredCitiesCreate.map((c: any) => ({ label: c.name, value: c.id }))"
                    :disabled="!createState.province_id"
                    placeholder="انتخاب شهر"
                />
              </UFormGroup>
            </ClientOnly>
          </div>

          <UFormGroup label="آدرس کامل" name="address" required>
            <UTextarea v-model="createState.address" placeholder="خیابان، کوچه، پلاک، واحد..." :rows="3"/>
          </UFormGroup>

          <div class="flex justify-end gap-3 pt-2">
            <UButton color="gray" variant="ghost" label="انصراف" @click="isOpenCreate = false"/>
            <UButton type="submit" :loading="loading" icon="i-heroicons-plus" label="افزودن آدرس"/>
          </div>

        </UForm>
      </UCard>
    </UModal>

  </div>
</template>