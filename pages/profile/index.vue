<script setup>
import {z} from 'zod'

const toast = useToast()
const {authUser} = useAuth()

const {data: user} = await useFetch('/api/profile/info', {
  headers: useRequestHeaders(['cookie'])
})

const formState = reactive({
  name: user.value?.name || '',
  email: user.value?.email || ''
})

const schema = z.object({
  name: z.string().min(1, 'نام و نام خانوادگی الزامی است'),
  email: z.string().min(1, 'ایمیل الزامی است').email('ایمیل نامعتبر است')
})

const loading = ref(false)

async function onSubmit() {
  try {
    loading.value = true
    await $fetch('/api/profile/info/edit', {method: 'POST', body: formState})
    toast.add({title: 'اطلاعات با موفقیت ذخیره شد', icon: 'i-heroicons-check-circle', color: 'green'})
  } catch (error) {
    const msg = Object.values(error?.data?.data?.message || {}).flat().join(' - ')
    toast.add({title: msg || 'خطایی رخ داده است', icon: 'i-heroicons-x-circle', color: 'red'})
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div dir="rtl" class="profile-form-page p-3 sm:p-5 lg:p-6">
    <UCard class="profile-form-card">
      <template #header>
        <div class="flex items-center gap-3">
          <UAvatar :alt="authUser?.name" size="md"/>
          <div class="min-w-0">
            <p class="font-semibold text-white truncate">{{ authUser?.name }}</p>
            <p class="text-sm text-white/55">ویرایش اطلاعات حساب کاربری</p>
          </div>
        </div>
      </template>

      <UForm :schema="schema" :state="formState" @submit="onSubmit" class="profile-form space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <UFormGroup label="نام و نام خانوادگی" name="name" required>
            <UInput v-model="formState.name" placeholder="نام خود را وارد کنید" icon="i-heroicons-user"/>
          </UFormGroup>
          <UFormGroup label="ایمیل" name="email" required>
            <UInput v-model="formState.email" type="email" placeholder="example@email.com" icon="i-heroicons-envelope"
                    dir="ltr"/>
          </UFormGroup>
          <UFormGroup label="شماره تلفن">
            <UInput :model-value="user?.cellphone" disabled icon="i-heroicons-phone" dir="ltr"/>
            <template #hint><span class="text-xs text-white/40">قابل ویرایش نیست</span></template>
          </UFormGroup>
        </div>

        <div class="flex justify-end sm:justify-start">
          <UButton type="submit" :loading="loading" icon="i-heroicons-check" label="ذخیره تغییرات"
                   class="bg-mainColor text-secColor font-bold"/>
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped>
.profile-form-page {
  min-height: calc(100vh - 2rem);
}

.profile-form-card {
  background: linear-gradient(150deg, rgba(7, 27, 36, .94), rgba(28, 27, 34, .94));
  border: 1px solid rgba(255, 190, 51, .14);
  color: white;
}

.profile-form :deep(label) {
  color: rgba(255, 255, 255, .78);
}

.profile-form :deep(input), .profile-form :deep(textarea), .profile-form :deep(select) {
  background: rgba(7, 27, 36, .92) !important;
  color: #fffaf0 !important;
  border-color: rgba(255, 190, 51, .18) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .035);
}

.profile-form :deep(input::placeholder), .profile-form :deep(textarea::placeholder) {
  color: rgba(255, 255, 255, .35) !important;
}

.profile-form :deep(input:focus), .profile-form :deep(textarea:focus), .profile-form :deep(select:focus) {
  border-color: #ffbe33 !important;
  box-shadow: 0 0 0 2px rgba(255, 190, 51, .10) !important;
}

.profile-form :deep(input:disabled) {
  background: rgba(255, 255, 255, .055) !important;
  color: rgba(255, 255, 255, .48) !important;
}

@media (max-width: 639px) {
  .profile-form-page {
    padding: .75rem !important;
  }

  .profile-form-card :deep(.p-6), .profile-form-card :deep(.sm\:p-8) {
    padding: 1rem !important;
  }

  .profile-form :deep(input), .profile-form :deep(textarea), .profile-form :deep(select) {
    min-height: 46px;
    border-radius: 14px;
  }

  .profile-form > div:last-child, .profile-form .flex.justify-end {
    width: 100%;
  }

  .profile-form .flex.justify-end :deep(button) {
    width: 100%;
    min-height: 46px;
  }
}
</style>