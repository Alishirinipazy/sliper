<script setup>
import { z } from 'zod'

const toast = useToast()
const { authUser } = useAuth()

const { data: user } = await useFetch('/api/profile/info', {
  headers: useRequestHeaders(['cookie'])
})

const formState = reactive({
  name:  user.value?.name  || '',
  email: user.value?.email || ''
})

const schema = z.object({
  name:  z.string().min(1, 'نام و نام خانوادگی الزامی است'),
  email: z.string()
      .min(1, 'ایمیل الزامی است')
      .email('ایمیل نامعتبر است')
})

const loading = ref(false)

async function onSubmit() {
  try {
    loading.value = true
    await $fetch('/api/profile/info/edit', {
      method: 'POST',
      body: formState
    })
    toast.add({
      title: 'اطلاعات با موفقیت ذخیره شد',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    })
  } catch (error) {
    const msg = Object.values(error?.data?.data?.message || {}).flat().join(' - ')
    toast.add({
      title: msg || 'خطایی رخ داده است',
      icon: 'i-heroicons-x-circle',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div dir="rtl" class="p-6">
    <UCard :ui="{ body: { padding: 'p-6 sm:p-8' } }">

      <!-- Header -->
      <template #header>
        <div class="flex items-center gap-3 px-6 py-4">
          <UAvatar
              :alt="authUser?.name"
              size="md"
          />
          <div>
            <p class="font-semibold text-gray-900 dark:text-white">{{ authUser?.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">ویرایش اطلاعات حساب کاربری</p>
          </div>
        </div>
      </template>

      <!-- Form -->
      <UForm :schema="schema" :state="formState" @submit="onSubmit" class="space-y-6">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <!-- Name -->
          <UFormGroup label="نام و نام خانوادگی" name="name" required>
            <UInput
                v-model="formState.name"
                placeholder="نام خود را وارد کنید"
                icon="i-heroicons-user"
            />
          </UFormGroup>

          <!-- Email -->
          <UFormGroup label="ایمیل" name="email" required>
            <UInput
                v-model="formState.email"
                type="email"
                placeholder="example@email.com"
                icon="i-heroicons-envelope"
                dir="ltr"
            />
          </UFormGroup>

          <!-- Phone (read-only) -->
          <UFormGroup label="شماره تلفن">
            <UInput
                :model-value="user?.cellphone"
                disabled
                icon="i-heroicons-phone"
                dir="ltr"
            />
            <template #hint>
              <span class="text-xs text-gray-400">قابل ویرایش نیست</span>
            </template>
          </UFormGroup>

        </div>

        <div class="flex justify-end">
          <UButton
              type="submit"
              :loading="loading"
              icon="i-heroicons-check"
              label="ذخیره تغییرات"
          />
        </div>

      </UForm>
    </UCard>
  </div>
</template>