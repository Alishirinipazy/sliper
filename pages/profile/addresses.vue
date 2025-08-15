<script setup lang="ts">

const {data, refresh} = await useFetch('/api/profile/addressess', {
  headers: useRequestHeaders(['cookie'])
})
const isOpen = ref(false)
const editAddress = ref([])
const address = ref([]);
data?.value?.addresses?.map((item) => {
  const items = {
    id:item?.id,
    title: item?.title,
    cellphone: item?.cellphone,
    postal_code: item?.postal_code,
    province: item?.province_id+'/'+item?.province_id,
    address:item?.address
  }
  address?.value?.push(items)
})
const editData = (items)=>{
  editAddress.value?.push(items)
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
    icon: 'i-heroicons-trash-20-solid'
  }],
]
function edit(){

}

</script>

<template>
  <UTable  :rows="address" :columns="columns" :ui="{th: {base: 'text-right', },}">


    <template #actions-data="{ row }">
      <UDropdown :items="items(row)">
        <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
      </UDropdown>
    </template>
  </UTable>
  <UModal v-model="isOpen" :ui="{background:'bg-secColor'}">
    <div class="text-white">
      <FormKit type="form" @submit="edit" #default="{ value }" :incomplete-message="false" :actions="false">

          <div class="">
            <div class="col col-md-6">
              <FormKit type="text" name="title" id="title" label="عنوان" label-class="form-label"
                       input-class="form-control" validation="required"
                       :validation-messages="{ required: 'کادر عنوان خالی است ' }" message-class="form-text text-danger"
                        />
            </div>
            <div class="col col-md-6">
              <FormKit type="text" name="cellphone" id="cellphone" label="شماره تماس" label-class="form-label"
                       input-class="form-control" :validation="[['required'], ['matches', /^(\+98|0)?9\d{9}$/]]"
                       :validation-messages="{ required: 'کادر شماره تماس خالی است ', 'matches': 'شماره تماس نا معتبر است' }"
                       message-class="form-text text-danger"  />
            </div>

            <div class="col col-md-6">
              <FormKit type="text" name="postal_code" id="postal_code" label="کد پستی" label-class="form-label"
                       input-class="form-control" validation="required"
                       :validation-messages="{ required: 'کادر کد پستی خالی است ' }" message-class="form-text text-danger"
                        />
            </div>
            <ClientOnly fallback-tag="span" fallback="در حال بارگذاری.....">
              <div class="col col-md-6">
<!--                <FormKit type="select" name="province_id" id="province_id" label="استان" label-class="form-label"-->
<!--                         @change="change" input-class="form-select" validation="required"-->
<!--                         :validation-messages="{ required: 'کادر استان خالی است ' }"-->
<!--                         message-class="form-text text-danger" :value="props.address.province_id">-->
<!--                  <option v-for="province in props.provinces" :key="province.id" :value="province.id">{{-->
<!--                      province.name }}</option>-->
<!--                </FormKit>-->
              </div>
              <div class="col col-md-6">
<!--                <FormKit type="select" ref="cityEl" name="city_id" id="city_id" label="شهر" label-class="form-label"-->
<!--                         input-class="form-select" validation="required" :value="props.address.city_id"-->
<!--                         :validation-messages="{ required: 'کادر شهر خالی است ' }" message-class="form-text text-danger">-->
<!--                  <option v-for="city in props.cities.filter((item) => item.province_id == value.province_id)"-->
<!--                          :key="city.id" :value="city.id">{{ city.name }}</option>-->
<!--                </FormKit>-->


              </div>
            </ClientOnly>
            <div class="col col-md-12">
              <FormKit type="textarea" name="address" id="address" label="آدرس" label-class="form-label"
                       input-class="form-control" validation="required"
                       :validation-messages="{ required: 'کادر آدرس خالی است ' }" message-class="form-text text-danger" />
            </div>
          </div>
          <div class="flex justify-center mt-4">
            <button type="submit" class="btn btn-primary">ویرایش</button>

          </div>

      </FormKit>
    </div>
  </UModal>

</template>

<style scoped>

</style>