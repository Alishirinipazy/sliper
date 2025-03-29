<script setup lang="ts">
const itemsSlider = [{
  image: 'https://s3-alpha-sig.figma.com/img/f06b/6d1c/ae4a8ea1c7753e6518555af491f20a71?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WIp~G9CpDSs5TM-qNhHRQf1ep9YGswF1L4WoxKvu2UIB61zIUY0alxFpoAwHUkts0ngopC5h4jGOTbqasvO6FP5puzTuUh2aQR~Uq7Ybo1xjo6eQOzbVyUipJSEtLRs6vTcuxA2Z9Rudji61LBYJWAfu47kveDPzOgpNzJMAxod~DRA-~t-JlkM80LEPb~r3PJCZmYZlpgvpoFVDkti1JMkQVsxo0htVmKYD3zSU4alQS04pZ9WlPZdeVCXhxLjJnKuChEU3OYapzBQKiJJOmSZy7NkdSJwO4wdcWdK-elDDyFb5PaKvSKwyxwr1qb0qvaBL~Z3G-59kS6Zl7btmiw__',
  title: 'با پولیشی سردی زمستون رو گرم کن!',
  dis: 'پولیشی های برند پاپا به زیبای تو پات می درخشتن ',
  link:'product?search:polish'
}, {
  image: 'https://s3-alpha-sig.figma.com/img/f06b/6d1c/ae4a8ea1c7753e6518555af491f20a71?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WIp~G9CpDSs5TM-qNhHRQf1ep9YGswF1L4WoxKvu2UIB61zIUY0alxFpoAwHUkts0ngopC5h4jGOTbqasvO6FP5puzTuUh2aQR~Uq7Ybo1xjo6eQOzbVyUipJSEtLRs6vTcuxA2Z9Rudji61LBYJWAfu47kveDPzOgpNzJMAxod~DRA-~t-JlkM80LEPb~r3PJCZmYZlpgvpoFVDkti1JMkQVsxo0htVmKYD3zSU4alQS04pZ9WlPZdeVCXhxLjJnKuChEU3OYapzBQKiJJOmSZy7NkdSJwO4wdcWdK-elDDyFb5PaKvSKwyxwr1qb0qvaBL~Z3G-59kS6Zl7btmiw__',
  title: 'با پولیشی سردی زمستون رو گرم کن!',
  dis: 'پولیشی های برند پاپا به زیبای تو پات می درخشتن ',
  link:'product?search:polish'
}]
const dataHotProduct = ref({
  title: 'دمپایی های داغ تابستونی',
  link: '/product?hots',
  product: [
    'https://picsum.photos/600/600?random=1',
    'https://picsum.photos/600/600?random=2',
    'https://picsum.photos/600/600?random=3',
    'https://picsum.photos/600/600?random=4',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
  ]
})
const dataHotAverg = ref({
  title: 'دمپایی های زنانه با تخفیفات بالا',
  link: '/product?hots',
  product: [
    'https://picsum.photos/600/600?random=7',
    'https://picsum.photos/600/600?random=8',
    'https://picsum.photos/600/600?random=9',
    'https://picsum.photos/600/600?random=10',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
  ]
})
const bannerItemData = ref([{
  image: 'https://s3-alpha-sig.figma.com/img/e396/943a/326b0d11bae991b86e9874e405d4b215?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=pAaJ6t~NV1ATVqswgxNOcovbv75ChoEF2MuMJrTryBsgJmYt~FSEIonlB3KWEp0kJtOvUwgnjA~31NM~Wg8z8D1Np2HRF4XXp8lkGpDmquQQsEcq1HR13Cx8VXA9U0NE20H4Mfwzjm1R7rO-6jUc9IUu~2O18lbqU3YyscM9C04qY-v69o-rgZjO3S5AtM97Q5ownjfl8Z1Cpd0mmXKuIamoozXQnE7yyg~HHcAzXujXk~xHUT5WgPhc0SNjHXsR44xqgBpvnpsi4rU8YMmEQ~PBbNzFrH7ePuhu-a~xq0vfHelcka3j11rXpseWU0RJR-1iXf2ovfXwuaY5tUtmAA__',
  dis: 'کفش های زنانه',
  link: '/product?title:women',
  class:'row-bg-temp'
}, {
  image: 'https://www.figma.com/file/XehxIyuXtBCOmok9HwUhA2/image/4a6f9c7c4e1a4ea7eb5dfc8de7982f880f8eaf19',
  dis: 'کیف های مدرن',
  link: '/product?title:buy',
  class:'row-bg-temp'
},
  {
    image: 'https://s3-alpha-sig.figma.com/img/e17f/7cb8/72e961cf52423949faaea4c758047d96?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=jUvM-rttNnUnQo6rT0JL3VSfjkSP8BfjzM1xMRuFt-tHuwDyWk5CqSMJ1cujnKwCeIP9PXZMkvI1RKwPBg9tr3zzVRUMg3WixAmHX~c~dQi5pn8nOxHnGXM5xWOYt7ze6NOf4TlxFEj0CDYRFGvblJbl6S5DTO~ZCZcK8AoBlodS~DWvz~AhlFCTASYPdfpH7mPLB0DiwI0oy2F8o4LWlI-tTy~e~yXnq6X7DVMOXl7o0hzwmYOtrsTjnOPBv7Tzex3R1kixhB9RZs5OJXxkbC9Qd1yKrWPEMUrBopoXVr18ZHL2s98LPeDSj8h4HQIK01Q3gGJYCm62G-CVpQYG1g__',
    dis: 'مانتو های بهاره درسص',
    link: 'https://www.nouraco.ir/',
    class:'col-bg-temp'
  },{
    image: 'https://www.figma.com/file/XehxIyuXtBCOmok9HwUhA2/image/cb771ba83a89ff72d9c8f41c1a059ff5e88c35f9',
    dis: 'کیف صندل ست مهراناز',
    link: 'https://www.nouraco.ir/',
    class:'col-bg-temp'
  },{
    image: 'https://s3-alpha-sig.figma.com/img/d1da/112e/032a26a2e3ade11f2e29f07a30151b53?Expires=1742169600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PSRCUEKaH5HmZt7UJtJrMYuSAYRZ8Xlq6GQEl0o~8MOojsMnwHQYEioJRUbvjvuVEpEa3AXpaKbtiylapHyK3AVQ6OuGRbv6aAH~p1DdpmmpNDjENfPW52lJf8UEMukOmqUlaUbB4I-uzCQgs03naDBCAbPQa80Ot5E9Ao8X1YdmfFnezZK78x5-JT1cjXNiAWADkJdDduE1zlm41RpFYDEuyNVR4J3BiPnxjLFY12SvhyNaVUKtl-xTp6usLvAtIKhNhCVrHTwCbJpkkNS20nM~7TUoxG712wXF5aEYuKuCDGnYNcTVEd9773PhJfhOvoH1vzMYEeQEEW5XdaiW~A__',
    dis: 'دمپایی های ناز دخترونه',
    link: '/product?search=women',
    class:'col-bg-temp'
  }])

useHead({
title:'خوونه'
})
</script>
<template>
  <GlobalSlider :items="itemsSlider" h="90vh"/>
  <u-container>
    <GlobalProductCard :dataProduct="dataHotProduct"/>
    <br>
    <HomeBanner :dataBanner="bannerItemData"/>
    <GlobalProductCard :dataProduct="dataHotAverg"/>

  </u-container>
</template>


