<script setup lang="ts">

const {data, refresh} = await useFetch('/api/profile/addressess', {
  headers: useRequestHeaders(['cookie'])
})
const loading = ref(false)
const toast = useToast()
const isOpen = ref(false)
const isOpenCreate = ref(false)
const dataAddress = ref()
const address = ref([]);
data?.value?.addresses?.map((item) => {
  const items = {
    id: item?.id,
    title: item?.title,
    cellphone: item?.cellphone,
    postal_code: item?.postal_code,
    province: item?.province_id + '/' + item?.province_id,
    address: item?.address
  }
  address?.value?.push(items)
})
const editData = (items) => {
  dataAddress.value = items
}
const columns = [{
  key: 'id',
  label: 'شماره'
}, {
  key: 'title',
  label: 'عنوان'
}, {
  key: 'cellphone',
  label: 'شماره تماس'
}, {
  key: 'postal_code',
  label: 'کد پستی'
}, {
  key: 'province',
  label: 'استان/شهر'
}, {
  key: 'address',
  label: 'آدرس'
}, {
  key: 'actions'
}]

const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner'
}, {
  id: 6,
  name: 'Floyd Miles',
  title: 'Principal Designer',
  email: 'floyd.miles@example.com',
  role: 'Member'
}]

async function deleteAddress(idAddress) {
  try {
    await $fetch('/api/profile/addressess/delete', {
      method: 'POST',
      body: {address_id: idAddress}
    })
    props.refresh();
    toast.add({title: " آدرست با موفقیت حذف شد"})
  } catch (error) {
    errorMSG.value = Object.values(error.data.data.message).flat()
    toast.add({
      title: `${errorMSG.value}`
    })
  }
}

const items = row => [
  [{
    label: 'ویرایش',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      isOpen.value = true
      editData(row)
    }
  }, {
    label: 'حذف',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      deleteAddress(row.id)
    }
  }],
]


// the send edit address in api
async function edite(formData) {
  try {
    loading.value = true
    await $fetch('/api/profile/addressess/edite', {
      method: 'POST',
      body: {...formData, address_id: dataAddress?.value?.id}
    })
    refresh();
    toast.add({title: "ویرایش آدرس شما با موفقیت انجام شد"})
  } catch (error) {

    errorMSG.value = Object.values(error.data.data.message).flat()
    toast.add({title: `${errorMSG.value}`})
  } finally {
    loading.value = false
    isOpen.value = false
  }
}
async function create(formData) {
  try {
    loading.value = true
    await $fetch('/api/profile/addressess/create', {
      method: 'POST',
      body: formData
    })

    toast.add({title: " آدرست با موفقیت ایجاد  شد"})
  } catch (error) {

    errorMSG.value = Object.values(error.data.data.message).flat()
    toast.add({title: `${errorMSG.value}`})
  } finally {
    loading.value = false
    isOpenCreate.value = false
  }
}
</script>

<template>
  <div class=" border-2 rounded-2xl  mx-3 my-2">
    <h5 class="font-bold px-2 mt-4 text-xl">آدرس هات</h5>
    <div class="flex justify-between p-2 border-b"><p>در این صفحه میتونی آدرس هایی که میخوای برات ارسال انجام بشه وارد کنی و یا تغییر بدی.</p>
    <UButton  color="yellow" @click="isOpenCreate=true">آدرس جدید</UButton>
    </div>
    <UTable
        :empty-state="{ icon: 'i-heroicons-circle-stack-20-solid', label: 'آدرسی نداری عزیزم'}"
        :rows="address" :columns="columns" :ui="{th: {base: 'text-right', },}">

      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid"/>
        </UDropdown>
      </template>
    </UTable>
  </div>
  <UModal v-model="isOpen" :ui="{background:'bg-secColor'}">

    <div class="text-white container">
      <FormKit type="form" @submit="edite" #default="{ value }" :incomplete-message="false" :actions="false">

        <div class="flex flex-wrap text-right mr-3 p-3">
          <div class="">
            <FormKit type="text" name="title" id="title" label="عنوان" label-class="form-label"
                     :value="dataAddress?.title"
                     input-class="form-control" validation="required"
                     :validation-messages="{ required: 'کادر عنوان خالی است ' }" message-class="form-text text-danger"
            />
          </div>
          <div class="">
            <FormKit type="text" name="cellphone" id="cellphone" label="شماره تماس" label-class="form-label"
                     :value="dataAddress?.cellphone"
                     input-class="form-control" :validation="[['required'], ['matches', /^(\+98|0)?9\d{9}$/]]"
                     :validation-messages="{ required: 'کادر شماره تماس خالی است ', 'matches': 'شماره تماس نا معتبر است' }"
                     message-class="form-text text-danger"/>
          </div>

          <div class="">
            <FormKit type="text" name="postal_code" id="postal_code" label="کد پستی" label-class="form-label"
                     :value="dataAddress?.postal_code"
                     input-class="form-control" validation="required"
                     :validation-messages="{ required: 'کادر کد پستی خالی است ' }" message-class="form-text text-danger"
            />
          </div>
          <ClientOnly fallback-tag="span" fallback="در حال بارگذاری.....">
            <div class="">
              <FormKit type="select" name="province_id" id="province_id" label="استان" label-class=""
                       @change="change" input-class="bg-mainColor text-secColor" validation="required"
                       :validation-messages="{ required: 'کادر استان خالی است ' }"
                       message-class="form-text text-danger" :value="dataAddress.province_id">
                <option v-for="province in data.provinces" :key="province.id" :value="province.id">{{
                    province.name
                  }}
                </option>
              </FormKit>
            </div>
            <div class="">
              <FormKit type="select" ref="cityEl" name="city_id" id="city_id" label="شهر" label-class="form-label"
                       input-class="w-100 rounded bg-mainColor " validation="required" :value="dataAddress.city_id"
                       :validation-messages="{ required: 'کادر شهر خالی است ' }" message-class="form-text text-danger">
                <option v-for="city in data.cities.filter((item) => item.province_id == value.province_id)"
                        :key="city.id" :value="city.id">{{ city.name }}
                </option>
              </FormKit>


            </div>
          </ClientOnly>
          <div>
            <FormKit type="textarea" name="address" id="address" label="آدرس" label-class="form-label"
                     input-class="form-control" validation="required"
                     :validation-messages="{ required: 'کادر آدرس خالی است ' }" message-class="form-text text-danger"
                     :value="dataAddress?.address"/>
          </div>
        </div>
        <div class="flex justify-center m-4">
          <UButton v-if="loading" loading color="yellow">صبر کن</UButton>
          <UButton v-else color="yellow" type="submit">ویرایش</UButton>
        </div>

      </FormKit>
    </div>
  </UModal>
  <UModal v-model="isOpenCreate" :ui="{background:'bg-secColor'}">

    <div class="text-white container">
      <FormKit type="form" @submit="create" #default="{ value }" :incomplete-message="false" :actions="false">

        <div class="flex flex-wrap text-right mr-3 p-3">
          <div class="">
            <FormKit type="text" name="title" id="title" label="عنوان" label-class="form-label"
                     input-class="form-control" validation="required"
                     :validation-messages="{ required: 'کادر عنوان خالی است ' }" message-class="form-text text-danger"
            />
          </div>
          <div class="">
            <FormKit type="text" name="cellphone" id="cellphone" label="شماره تماس" label-class="form-label"
                     input-class="form-control" :validation="[['required'], ['matches', /^(\+98|0)?9\d{9}$/]]"
                     :validation-messages="{ required: 'کادر شماره تماس خالی است ', 'matches': 'شماره تماس نا معتبر است' }"
                     message-class="form-text text-danger"/>
          </div>

          <div class="">
            <FormKit type="text" name="postal_code" id="postal_code" label="کد پستی" label-class="form-label"
                     input-class="form-control" validation="required"
                     :validation-messages="{ required: 'کادر کد پستی خالی است ' }" message-class="form-text text-danger"
            />
          </div>
          <ClientOnly fallback-tag="span" fallback="در حال بارگذاری.....">
            <div class="">
              <FormKit type="select" name="province_id" id="province_id" label="استان" label-class=""
                       @change="change" input-class="bg-mainColor text-secColor" validation="required"
                       :validation-messages="{ required: 'کادر استان خالی است ' }"
                       message-class="form-text text-danger" >
                <option v-for="province in data.provinces" :key="province.id" :value="province.id">{{
                    province.name
                  }}
                </option>
              </FormKit>
            </div>
            <div class="">
              <FormKit type="select" ref="cityEl" name="city_id" id="city_id" label="شهر" label-class="form-label"
                       input-class="w-100 rounded bg-mainColor " validation="required"
                       :validation-messages="{ required: 'کادر شهر خالی است ' }" message-class="form-text text-danger">
                <option v-for="city in data.cities.filter((item) => item.province_id == value.province_id)"
                        :key="city.id" :value="city.id">{{ city.name }}
                </option>
              </FormKit>


            </div>
          </ClientOnly>
          <div>
            <FormKit type="textarea" name="address" id="address" label="آدرس" label-class="form-label"
                     input-class="form-control" validation="required"
                     :validation-messages="{ required: 'کادر آدرس خالی است ' }" message-class="form-text text-danger"
                     />
          </div>
        </div>
        <div class="flex justify-center m-4">
          <UButton v-if="loading" loading color="yellow">صبر کن</UButton>
          <UButton v-else color="yellow" type="submit">ایجاد</UButton>
        </div>

      </FormKit>
    </div>
  </UModal>
</template>

<style scoped>

</style>