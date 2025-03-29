<script setup lang="ts">

const itemsSlider = {
  image: 'https://s3-alpha-sig.figma.com/img/07ad/f4c0/8fb1c05f6ea50a557035077caefb5c35?Expires=1742774400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Gxb2Ria3AdCWDu7DFCHfKEvgWupXJzU-IfKpSHONsE-ty3F0ZeIxsY0UIPd2yN~f14M2BCOVtRpXqvZ4ZK2W5GCjdQQY2dJVJI1vQA7dIzJ-H0LNHsJTofhWhNHck9CLBHvtUmUH8gVqIlztFWmIJQhBnLQ7TdGnsPP9scS4EdM-iQFPBM5e-oyPPSSeu3C5AROerbyEeP6kG0V~HwKfu5JbdOCrS140ZdVdLAoEixg4zC-hGHuaaIoq-fPHD16uPquO~khw8eIC9vrx-tIFdUMOsThj6cUSmqHm2M7p0y9KZ2PtOKe8o7L7NJe~zVQ9-2fkphOqmn4OivaDc2lrKA__',
  title: 'محصولاتمون',
  dis: 'همه محصولات اسلیپر استور رو میتونی از اینجا با جزئیات بیشتر ببینی'
}
const products = [
  'https://picsum.photos/600/600?random=1',
  'https://picsum.photos/600/600?random=2',
  'https://picsum.photos/600/600?random=3',
  'https://picsum.photos/600/600?random=4',
  'https://picsum.photos/600/600?random=5',
  'https://picsum.photos/600/600?random=6'
]
const people = ['زنونه', 'بچگونه','مردونه']

const selected = ref(people[0])

useHead({
  title: 'محصولاتمون'
})
</script>
<template>
  <GlobalSlider :items="itemsSlider" h="50vh"/>
  <UContainer>
  <div class="grid lg:grid-cols-3 px-2 py-1">
    <UInputMenu placeholder="سایزبندی" v-model="selected" :options="people" />
  </div>
    <div class="grid  grid-cols-2 lg:grid-cols-4 gap-2">
      <template v-for="(item,index) in products">
        <ProductIitem :product="item"/>
      </template>
    </div>
  </UContainer>
</template>

