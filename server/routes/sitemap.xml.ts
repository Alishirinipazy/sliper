function escapeXml(value: string) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const { public: { apiBase, siteUrl } } = useRuntimeConfig()

  let products: { slug: string; updated_at?: string }[] = []
  let categories: { id: number; name: string }[] = []

  try {
    const res = await $fetch<{ data?: { products?: typeof products; categories?: typeof categories } }>(
      `${apiBase}/sitemap-data`
    )
    products = res.data?.products ?? []
    categories = res.data?.categories ?? []
  } catch {
    // Keep the static URLs available if the API is temporarily unavailable.
  }

  const urls = [
    {
      loc: `${siteUrl}/`,
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      loc: `${siteUrl}/products`,
      changefreq: 'daily',
      priority: '0.9'
    },
    ...categories.map((category) => ({
      loc: `${siteUrl}/products?category=${category.id}`,
      changefreq: 'daily',
      priority: '0.7'
    })),
    ...products
      .filter((product) => product.slug)
      .map((product) => ({
        loc: `${siteUrl}/products/${encodeURIComponent(product.slug)}`,
        lastmod: product.updated_at?.slice(0, 10),
        changefreq: 'weekly',
        priority: '0.8'
      }))
  ]

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
${url.lastmod ? `    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n` : ''}    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return body
})
