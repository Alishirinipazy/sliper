<script setup>
const toast = useToast();
const errorMSG = ref([]);
const {authUser} = useAuth()
const { data: user } = await useFetch('/api/profile/info', {
  headers: useRequestHeaders(['cookie'])
})

async function edit(formData){
  try {
    await $fetch('/api/profile/info/edit', {
      method: 'POST',
      body: formData
    })
    toast.add({title:"تغییراتی که دوست داشتی با موفقیت انجام دادیم"})
  } catch (error) {
    errorMSG.value = Object.values(error.data.data.message).flat()
    toast.add({title:`${errorMSG.value}`})
  }
}
</script>
<template>
  <div class="m-10 bg-secColor text-white p-2 lg:p-10 rounded">
    <h3 class="font-bold">{{ authUser?.name }} عزیز</h3>
  <FormKit type="form" @submit="edit" :incomplete-message="false" :actions="false">
    <div class="lg:grid grid-cols-12 lg:p-6 p-2 ">
      <div class="lg:col-span-6 my-2 ">
        <FormKit type="text" name="name" id="name" label="نام و نام خانوادگی" label-class="form-label"
                 input-class="form-control" validation="required"
                 :validation-messages="{ required: 'کادر نام و نام خانوادگی خالی است ' }"
                 message-class="form-text text-danger" :value="user.name" />
      </div>
      <div class="lg:col-span-6 my-2">
        <FormKit type="email" name="email" id="email" label="ایمیل" label-class="form-label"
                 input-class="form-control" validation="required | email"
                 :validation-messages="{ required: 'کادر ایمیل  خالی است ', email: 'ایمیل شما نا معتبر می باشد' }"
                 message-class="form-text text-danger" :value="user.email" />
      </div>
      <div class="lg:col-span-3 my-2">
        <label class="form-label">شماره تلفن</label>
        <input type="text" disabled class="form-control" :value="user.cellphone">
      </div>
    </div>
    <UButton class="rounded-full my-2" label="ویرایش" type="submit" color="yellow"/>
  </FormKit>
  </div>
</template>
<style>
.form-control {
  @apply p-2 m-2 rounded text-secColor
}
.form-text {
  @apply text-red-600
}
</style>