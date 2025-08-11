<script setup>


const toast = useToast()
const emit = defineEmits(['showCheckOtpForm'])
const cellphone = ref(null);
const pattern = /^(\+98|0)?9\d{9}$/;
const loading = ref(false);

const router = useRouter()


async function login() {
  if (cellphone.value == null) {

    toast.add({title: 'شماره تلفنت رو که وارد نکردیی ؟'})
    return
  }
  if (!pattern.test(cellphone.value)) {
    toast.add({title: 'شماره تلفنت رو درست حسابی وارد کن...'})
    return
  }
  try {
    loading.value = true;
    // let data = await apiLogin($request,  {cellphone: cellphone?.value})
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { cellphone: cellphone?.value }
    })
    console.log(data)
    toast.add({title: `کد تایید به شماره ${cellphone?.value} ارسال شد`});
    emit('showCheckOtpForm')
    router.push({
      path: '/auth/login',
      query: {cellphone: cellphone?.value}
    })
  } catch (error) {


  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="py-8 border border-mainColor bg-secColor text-white rounded-2xl flex flex-col items-center  border-2 ">
    <img src="/images/logo.png" alt="اسلیپر استور" class="w-2/5">
    <h3 class="text-2xl mt-3 mb-4"> ورود و ثبت نام </h3>

    <p>شماره تماست برای ما بفرست که یک کدی رو برات بفرستیم</p>
    <form @submit.prevent="login" class="mt-5 w-12/12 lg:w-5/12 text-center">
      <input type="tel" v-model="cellphone"
             class="p-1 w-full my-3 text-secColor text-center border-mainColor rounded border-2 "
             placeholder="09100000000">
      <button class="my-2 text-center bg-mainColor w-full rounded py-2">
        ورود

      </button>
    </form>

  </div>
</template>