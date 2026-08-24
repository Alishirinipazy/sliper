<script setup lang="ts">
const siteUrl = 'https://slipperpaz.ir'

useHead({
  htmlAttrs: { lang: 'fa', dir: 'rtl' },
  meta: [
    { name: 'theme-color', content: '#1c1b22' },
    { name: 'color-scheme', content: 'dark' }
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/icon.ico' }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'اسلیپر پاز', alternateName: 'Slipper Paz', url: `${siteUrl}/`, logo: `${siteUrl}/images/logo.png` }) },
    { type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'اسلیپر پاز', alternateName: 'Slipper Paz', url: `${siteUrl}/`, publisher: { '@id': `${siteUrl}/#organization` }, potentialAction: { '@type': 'SearchAction', target: `${siteUrl}/products?search={search_term_string}`, 'query-input': 'required name=search_term_string' } }) }
  ]
})
</script>

<template>
  <NuxtLoadingIndicator color="#ffbe33"/>
  <nuxt-page/>
  <UNotifications/>
  <ClientOnly><ChatBot/></ClientOnly>
</template>

<style>
:root {
  --main-color: #ffbe33;
  --main-color-soft: rgba(255, 190, 51, .14);
  --main-color-glow: rgba(255, 190, 51, .28);
  --aqua-900: #0f1015;
  --aqua-800: #171820;
  --aqua-700: #25252b;
  --glass: rgba(28, 27, 34, .62);
  --glass-soft: rgba(255, 255, 255, .08);
  --glass-border: rgba(255, 190, 51, .18);
}

html { background: var(--aqua-900); }
body {
  margin: 0;
  min-height: 100vh;
  color: #fffaf0;
  background:
    radial-gradient(circle at 15% 10%, rgba(255,190,51,.10), transparent 28rem),
    radial-gradient(circle at 90% 30%, rgba(229,139,154,.09), transparent 30rem),
    linear-gradient(160deg, #0f1015 0%, #171820 48%, #111216 100%);
  background-attachment: fixed;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  opacity: .35;
  background-image: radial-gradient(circle at 20% 20%, rgba(255,190,51,.16) 0 1px, transparent 2px);
  background-size: 46px 46px;
}

* { scrollbar-color: rgba(255,190,51,.45) transparent; }
*::-webkit-scrollbar { width: 7px; height: 7px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: rgba(255,190,51,.30); border-radius: 999px; }

.aqua-glass {
  background: linear-gradient(145deg, rgba(255,255,255,.11), rgba(255,255,255,.035));
  border: 1px solid var(--glass-border);
  box-shadow: 0 18px 50px rgba(0, 0, 0, .28), inset 0 1px 0 rgba(255,255,255,.1);
  backdrop-filter: blur(18px) saturate(135%);
  -webkit-backdrop-filter: blur(18px) saturate(135%);
}

.aqua-pill {
  border: 1px solid rgba(255,190,51,.20);
  background: rgba(255,255,255,.065);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
  backdrop-filter: blur(14px);
}

.aqua-glow { box-shadow: 0 0 28px var(--main-color-glow); }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
</style>