<template>
  <footer class="relative bg-secColor rounded-t-3xl px-6 py-12 text-cyan-50">
    <u-container>
      <div class="flex flex-wrap justify-center lg:grid lg:grid-flow-col py-5 grid-cols-3 sm:grid-rows-3">
        <div class="row-span-5">
          <img src="/images/logo.avif" alt="اسلیپر استور" class="w-6/12">
          <h6 class="text-amber-400 px-5">با عشـــ❤️ــق پیش قدماتیم</h6>
          <p class="py-2 px-5">نخستین پلتفرم فروش انواع دمپایی و مد استایل </p>
        </div>
        <div class="row-span-3 flex lg:justify-around justify-center ">
          <div class="text-center lg:text-right">
            <h5 class="text-2xl py-3 text-amber-400">منو</h5>
          <ul class="">
            <li class="p-2 ">
              <nuxt-link to="/" @click="isOpen = false">
                خونه
              </nuxt-link>
            </li>
            <li class="p-2 ">
              <nuxt-link to="/products" @click="isOpen = false">
                محصولاتمون
              </nuxt-link>
            </li>
            <li class="p-2 ">
              <nuxt-link to="/about" @click="isOpen = false">
                دربارمون
              </nuxt-link>
            </li>
            <li class="p-2 ">
              <nuxt-link to="/contact" @click="isOpen = false">
                تماس با ما
              </nuxt-link>
            </li>
          </ul>
          </div>
          <div class="text-center lg:text-right">

            <h5 class="text-2xl py-3 text-amber-400">محصولاتمون</h5>
            <ul class="">
              <li class="p-2 ">
                <nuxt-link to="/" @click="isOpen = false">
                  دمپایی
                </nuxt-link>
              </li>
              <li class="p-2 ">
                <nuxt-link to="/products" @click="isOpen = false">
                  کیف ها
                </nuxt-link>
              </li>
              <li class="p-2 ">
                <nuxt-link to="/about" @click="isOpen = false">
                  کفش
                </nuxt-link>
              </li>
              <li class="p-2 ">
                <nuxt-link to="/contact" @click="isOpen = false">
                  اکسسوری
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
        <div class="row-span-3 lg:text-right text-center ">
          <br><br>
          <p class="py-2">آدرس انبار : تهران منیریه امیریه خیابان فروزش کوچه رضایی مجد</p>
          <a class="py-2" href="tel:+989918608594">09918608594</a>
          <br>
          <a class="py-2" href="tel:+989372396496">09372396496</a>
          <br>
          <a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=759742&Code=I2pfln9Epa4AcXM0lSUb37egd1Fwq0Nb'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=759742&Code=I2pfln9Epa4AcXM0lSUb37egd1Fwq0Nb' alt='' style='cursor:pointer' code='I2pfln9Epa4AcXM0lSUb37egd1Fwq0Nb'></a>
        </div>

      </div>
    </u-container>
    <div class="absolute -bottom-8">

      <img src="/images/alipaz.png" alt="">
    </div>
  </footer>
</template>
<script setup lang="ts">
</script>