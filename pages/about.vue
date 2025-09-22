<script setup>
const itemsSlider = {
  image: '/images/img_5.png',
}
</script>
<template>
  <LayoutsHeader/>

  <GlobalSlider :items="itemsSlider" h="lg:h-[40vh] h-[30vh]"/>
  <u-container>
    <div class="relative w-full">
      <div class="absolute -top-36 z-20 w-full flex justify-center" >
        <img class="border-amber-50 w-8/12 lg:w-4/12  border-2 rounded-2xl" src="/images/abote.png" alt="درباره ما">
      </div>
    </div>
      <div class="pt-32 w-full flex flex-col items-center">
      <h3 class="font-extrabold text-mainColor text-right text-2xl pt-2 w-3/4"> سلام سلامی به گرمی خواندن این متن :)</h3>
      <p class="border-mainColor leading-10 lg:text-xl p-3 m-3  border-2 subpixel-antialiased lg:w-8/12 border-dashed rounded-2xl"> تو سرمای زمستان سال 1402 به واسته مدیر شرکتی که کار میکردم وارد بازار بزرگ دمپایی شدم در آنجا یک پاساژ که در یکی از غرفه های آنجا من ادیت عکس های که از دمپایی ها گرفته می شد رو انجام میدادم همه غرفه ها دمپایی صندل و.... خیلی برای من لذت بخش بود که فرآیند های تولید حمل و فروش دمپایی به صورت آنلاین چقدر میتونی جذاب باشه برای همین تو زمستون 1403 سایتی رو با عشق ساختم سال 1404 با عشق تیمی رو جمع کردیم که بتونیم با عشق این پلتفرم رو با ایده های جذاب راه اندازی کنیم تمامی شروط کار کردن با عشق از خرید و بسته بندی بارگذاری در سایت تا ارسال تا درب خونه هاتون برای همین که گفیتم <span class="text-mainColor text-xl font-bold"> با عشق که زیر پاتیم</span></p>
      </div>

  </u-container>
  <LayoutsFooter/>
</template>

