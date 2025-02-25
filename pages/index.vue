<script setup lang="ts">
const itemsSlider = [{
  image: 'https://s3-alpha-sig.figma.com/img/f06b/6d1c/ae4a8ea1c7753e6518555af491f20a71?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WIp~G9CpDSs5TM-qNhHRQf1ep9YGswF1L4WoxKvu2UIB61zIUY0alxFpoAwHUkts0ngopC5h4jGOTbqasvO6FP5puzTuUh2aQR~Uq7Ybo1xjo6eQOzbVyUipJSEtLRs6vTcuxA2Z9Rudji61LBYJWAfu47kveDPzOgpNzJMAxod~DRA-~t-JlkM80LEPb~r3PJCZmYZlpgvpoFVDkti1JMkQVsxo0htVmKYD3zSU4alQS04pZ9WlPZdeVCXhxLjJnKuChEU3OYapzBQKiJJOmSZy7NkdSJwO4wdcWdK-elDDyFb5PaKvSKwyxwr1qb0qvaBL~Z3G-59kS6Zl7btmiw__',
  title: 'با پولیشی سردی زمستون رو گرم کن!',
  dis: 'پولیشی های برند پاپا به زیبای تو پات می درخشتن '
},{
  image: 'https://s3-alpha-sig.figma.com/img/f06b/6d1c/ae4a8ea1c7753e6518555af491f20a71?Expires=1740960000&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=WIp~G9CpDSs5TM-qNhHRQf1ep9YGswF1L4WoxKvu2UIB61zIUY0alxFpoAwHUkts0ngopC5h4jGOTbqasvO6FP5puzTuUh2aQR~Uq7Ybo1xjo6eQOzbVyUipJSEtLRs6vTcuxA2Z9Rudji61LBYJWAfu47kveDPzOgpNzJMAxod~DRA-~t-JlkM80LEPb~r3PJCZmYZlpgvpoFVDkti1JMkQVsxo0htVmKYD3zSU4alQS04pZ9WlPZdeVCXhxLjJnKuChEU3OYapzBQKiJJOmSZy7NkdSJwO4wdcWdK-elDDyFb5PaKvSKwyxwr1qb0qvaBL~Z3G-59kS6Zl7btmiw__',
  title: 'با پولیشی سردی زمستون رو گرم کن!',
  dis: 'پولیشی های برند پاپا به زیبای تو پات می درخشتن '
}]
const dataHotProduct = ref({
  title:'دمپایی های داغ تابستونی',
  link:'/product?hots',
  product:[
    'https://picsum.photos/600/600?random=1',
    'https://picsum.photos/600/600?random=2',
    'https://picsum.photos/600/600?random=3',
    'https://picsum.photos/600/600?random=4',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
  ]
})
const dataHotAverg = ref({
  title:'دمپایی های زنانه با تخفیفات بالا',
  link:'/product?hots',
  product:[
    'https://picsum.photos/600/600?random=7',
    'https://picsum.photos/600/600?random=8',
    'https://picsum.photos/600/600?random=9',
    'https://picsum.photos/600/600?random=10',
    'https://picsum.photos/600/600?random=5',
    'https://picsum.photos/600/600?random=6'
  ]
})
</script>
<template>
  <GlobalSlider :items="itemsSlider"/>
  <u-container>
  <GlobalProductCard :dataProduct="dataHotProduct"/>
    <br>
  <GlobalProductCard :dataProduct="dataHotAverg"/>
  </u-container>
</template>


