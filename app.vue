<script setup lang="ts">
const siteUrl = 'https://slipperpaz.ir'

useHead({
  htmlAttrs: {
    lang: 'fa',
    dir: 'rtl'
  },
  meta: [
    { name: 'theme-color', content: '#ffbe33' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/icon.ico' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'اسلیپر پاز',
        alternateName: 'Slipper Paz',
        url: `${siteUrl}/`,
        logo: `${siteUrl}/images/logo.png`
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'اسلیپر پاز',
        alternateName: 'Slipper Paz',
        url: `${siteUrl}/`,
        publisher: { '@id': `${siteUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
})
</script>

<template>
  <NuxtLoadingIndicator color="#ffbe33"/>
  <nuxt-page/>
  <UNotifications/>
  <ClientOnly>
    <ChatBot/>
  </ClientOnly>
</template>

<style>
body {
  @apply bg-slate-200
}
</style>
