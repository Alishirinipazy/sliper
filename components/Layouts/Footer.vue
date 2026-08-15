<template>
  <footer class="relative bg-secColor rounded-t-3xl px-6 py-12 text-cyan-50">
    <u-container>
      <div class="flex flex-wrap justify-center lg:grid lg:grid-flow-col py-5 grid-cols-3 sm:grid-rows-3">
        <div class="row-span-5">
          <img src="/images/logo.avif" alt="اسلیپر پاز" class="w-6/12">
          <h6 class="text-amber-400">با عشـــ❤️ــق پیش قدماتیم</h6>
          <p class="py-2">نخستین پلتفرم فروش انواع دمپایی و مد استایل </p>
          <p class="py-1">ما رو در چنل های زیر دنبال کنید .</p>
          <div class="flex gap-1">
            <a href="https://eitaa.com/slipperpaz" target="_blank" rel="noopener"
               class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
              <svg fill="#ffffff" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5.968 23.942a6.624 6.624 0 0 1-2.332-.83c-1.62-.929-2.829-2.593-3.217-4.426-.151-.717-.17-1.623-.15-7.207C.288 5.47.274 5.78.56 4.79c.142-.493.537-1.34.823-1.767C2.438 1.453 3.99.445 5.913.08c.384-.073.94-.08 6.056-.08 6.251 0 6.045-.009 7.066.314a6.807 6.807 0 0 1 4.314 4.184c.33.937.346 1.087.369 3.555l.02 2.23-.391.268c-.558.381-1.29 1.06-2.316 2.15-1.182 1.256-2.376 2.42-2.982 2.907-1.309 1.051-2.508 1.651-3.726 1.864-.634.11-1.682.067-2.302-.095-.553-.144-.517-.168-.726.464a6.355 6.355 0 0 0-.318 1.546l-.031.407-.146-.03c-1.215-.241-2.419-1.285-2.884-2.5a3.583 3.583 0 0 1-.26-1.219l-.016-.34-.309-.284c-.644-.59-1.063-1.312-1.195-2.061-.212-1.193.34-2.542 1.538-3.756 1.264-1.283 3.127-2.29 4.953-2.68.658-.14 1.818-.177 2.403-.075 1.138.198 2.067.773 2.645 1.639.182.271.195.31.177.555a.812.812 0 0 1-.183.493c-.465.651-1.848 1.348-3.336 1.68-2.625.585-4.294-.142-4.033-1.759.026-.163.04-.304.031-.313-.032-.032-.293.104-.575.3-.479.334-.903.984-1.05 1.607-.036.156-.05.406-.034.65.02.331.053.454.192.736.092.186.275.45.408.589l.24.251-.096.122a4.845 4.845 0 0 0-.677 1.217 3.635 3.635 0 0 0-.105 1.815c.103.461.421 1.095.739 1.468.242.285.797.764.886.764.024 0 .044-.048.044-.106.001-.23.184-.973.326-1.327.423-1.058 1.351-1.96 2.82-2.74.245-.13.952-.47 1.572-.757 1.36-.63 2.103-1.015 2.511-1.305 1.176-.833 1.903-2.065 2.14-3.625.086-.57.086-1.634 0-2.207-.368-2.438-2.195-4.096-4.818-4.37-2.925-.307-6.648 1.953-8.942 5.427-1.116 1.69-1.87 3.565-2.187 5.443-.123.728-.169 2.08-.093 2.75.193 1.704.822 3.078 1.903 4.156a6.531 6.531 0 0 0 1.87 1.313c2.368 1.13 4.99 1.155 7.295.071.996-.469 1.974-1.196 3.023-2.25 1.02-1.025 1.71-1.88 3.592-4.458 1.04-1.423 1.864-2.368 2.272-2.605l.15-.086-.019 3.091c-.018 2.993-.022 3.107-.123 3.561-.6 2.678-2.54 4.636-5.195 5.242l-.468.107-5.775.01c-4.734.008-5.85-.002-6.19-.056z"></path></g></svg>
            </a> <a href="https://www.instagram.com/slipperpaz" target="_blank" rel="noopener"
                    class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
            <UIcon name="simple-icons:instagram" class="w-4 h-4"/>
          </a>
            <a href="http://t.me/slipperpaz" target="_blank" rel="noopener"
               class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
              <UIcon name="simple-icons:telegram" class="w-4 h-4"/>
            </a>
            <a href="https://wa.link/t5isoi" target="_blank" rel="noopener"
               class="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/10 hover:bg-mainColor hover:text-secColor flex items-center justify-center text-white transition">
              <UIcon name="simple-icons:whatsapp" class="w-4 h-4"/>
            </a>
          </div>
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
              <li class="p-2 " >
                <nuxt-link to="/products?category=2" @click="isOpen = false">
                  دمپایی
                </nuxt-link>
              </li>
              <li class=" ">
                <UButton variant="ghost" size="xl" to="/products" disabled>کیف</UButton>

              </li>
              <li class=" ">
                <UButton variant="ghost"  size="xl" to="/products" disabled>کفش</UButton>

              </li>
              <li class=" ">
                <UButton variant="ghost"  size="xl" to="/products" disabled>صندل</UButton>

              </li>
            </ul>
          </div>
        </div>
        <div class="row-span-3 lg:text-right text-center ">
          <br><br>
          <p class="py-2">آدرس انبار : قم شهرک فاطمیه خیابان بعثت کوچه 5 انبار پاز</p>
          <a class="py-2" href="tel:+989918608594">09918608594</a>
          <br>
          <a class="py-2" href="tel:+989372396496">09372396496</a>
          <br>
          <a referrerpolicy='origin' target='_blank'
             href='https://trustseal.enamad.ir/?id=759742&Code=I2pfln9Epa4AcXM0lSUb37egd1Fwq0Nb'><img
              referrerpolicy='origin'
              src='https://trustseal.enamad.ir/logo.aspx?id=759742&Code=I2pfln9Epa4AcXM0lSUb37egd1Fwq0Nb' alt=''
              style='cursor:pointer' code='I2pfln9Epa4AcXM0lSUb37egd1Fwq0Nb'></a>
        </div>

      </div>
    </u-container>
    <div class="absolute -bottom-14 left-1 w-full">


    </div>
  </footer>
  <div class="bg-black h-[3rem] w-full"></div>
</template>
<script setup lang="ts">
</script>