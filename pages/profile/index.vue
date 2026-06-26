<script setup>
const toast = useToast()
const { authUser } = useAuth()
const { data: user } = await useFetch('/api/profile/info', {
  headers: useRequestHeaders(['cookie'])
})

const form = ref({
  name: user.value?.name ?? '',
  email: user.value?.email ?? ''
})

const errors = ref({})
const loading = ref(false)

function validate() {
  errors.value = {}
  if (!form.value.name) errors.value.name = 'کادر نام و نام خانوادگی خالی است'
  if (!form.value.email) errors.value.email = 'کادر ایمیل خالی است'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'ایمیل شما نامعتبر می‌باشد'
  return Object.keys(errors.value).length === 0
}

async function edit() {
  if (!validate()) return
  try {
    loading.value = true
    await $fetch('/api/profile/info/edit', {
      method: 'POST',
      body: form.value
    })
    toast.add({ title: 'تغییراتی که دوست داشتی با موفقیت انجام دادیم' })
  } catch (error) {
    const msg = Object.values(error.data?.data?.message ?? {}).flat()
    toast.add({ title: `${msg}` })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="m-10 bg-secColor text-white p-2 lg:p-10 rounded">
    <h3 class="font-bold mb-6">{{ authUser?.name }} عزیز</h3>

    <div class="lg:grid grid-cols-12 gap-4">
      <div class="lg:col-span-6 my-2">
        <UFormGroup label="نام و نام خانوادگی" :error="errors.name">
          <UInput v-model="form.name" placeholder="نام و نام خانوادگی" />
        </UFormGroup>
      </div>

      <div class="lg:col-span-6 my-2">
        <UFormGroup label="ایمیل" :error="errors.email">
          <UInput v-model="form.email" type="email" placeholder="ایمیل" />
        </UFormGroup>
      </div>

      <div class="lg:col-span-3 my-2">
        <UFormGroup label="شماره تلفن">
          <UInput :value="user?.cellphone" disabled />
        </UFormGroup>
      </div>
    </div>

    <UButton
        class="rounded-full mt-6"
        label="ویرایش"
        color="yellow"
        :loading="loading"
        @click="edit"
    />
  </div>
</template>