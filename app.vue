<script setup lang="ts">
const siteUrl = 'https://slipperpaz.ir'

useHead({
  htmlAttrs: { lang: 'fa', dir: 'rtl' },
  meta: [
    { name: 'theme-color', content: '#071f2e' },
    { name: 'color-scheme', content: 'dark' }
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.ico' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Organization',
        '@id': `${siteUrl}/#organization`, name: 'اسلیپر پاز', alternateName: 'Slipper Paz',
        url: `${siteUrl}/`, logo: `${siteUrl}/images/logo.png`
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'WebSite',
        '@id': `${siteUrl}/#website`, name: 'اسلیپر پاز', alternateName: 'Slipper Paz',
        url: `${siteUrl}/`, publisher: { '@id': `${siteUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction', target: `${siteUrl}/products?search={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
})
</script>

<template>
  <NuxtLoadingIndicator color="#31d8ff"/>
  <nuxt-page/>
  <UNotifications/>
  <ClientOnly><ChatBot/></ClientOnly>
</template>

<style>
:root {
  --aqua-900: #04151f;
  --aqua-800: #072536;
  --aqua-700: #0b3549;
  --aqua-500: #159cc4;
  --aqua-300: #6ce7ff;
  --aqua-glow: rgba(49, 216, 255, .28);
  --glass: rgba(9, 43, 58, .58);
  --glass-soft: rgba(255, 255, 255, .08);
  --glass-border: rgba(169, 238, 255, .18);
}

html { background: var(--aqua-900); }
body {
  margin: 0;
  min-height: 100vh;
  color: #eafaff;
  background:
    radial-gradient(circle at 15% 10%, rgba(30, 173, 214, .18), transparent 28rem),
    radial-gradient(circle at 90% 30%, rgba(15, 112, 154, .18), transparent 30rem),
    linear-gradient(160deg, #04151f 0%, #072b3b 48%, #03141e 100%);
  background-attachment: fixed;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  opacity: .35;
  background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,.12) 0 1px, transparent 2px);
  background-size: 46px 46px;
}

* { scrollbar-color: rgba(108, 231, 255, .45) transparent; }
*::-webkit-scrollbar { width: 7px; height: 7px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: rgba(108, 231, 255, .3); border-radius: 999px; }

.aqua-glass {
  background: linear-gradient(145deg, rgba(255,255,255,.11), rgba(255,255,255,.035));
  border: 1px solid var(--glass-border);
  box-shadow: 0 18px 50px rgba(0, 8, 14, .28), inset 0 1px 0 rgba(255,255,255,.1);
  backdrop-filter: blur(18px) saturate(135%);
  -webkit-backdrop-filter: blur(18px) saturate(135%);
}

.aqua-pill {
  border: 1px solid rgba(155, 235, 255, .2);
  background: rgba(255,255,255,.065);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
  backdrop-filter: blur(14px);
}

.aqua-glow { box-shadow: 0 0 28px var(--aqua-glow); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
</style>