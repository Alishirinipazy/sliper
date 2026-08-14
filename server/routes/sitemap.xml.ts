type SitemapProduct = { slug?: string; updated_at?: string | null }
type SitemapCategory = { id?: number | string; name?: string }

type SitemapResponse = {
  data?: {
    products?: SitemapProduct[]
    categories?: SitemapCategory[]
    meta?: Record<string, any>
  }
}

function escapeXml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function validDate(value?: string | null) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString().slice(0, 10)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')
  const siteUrl = String(config.public.siteUrl || 'https://slipperpaz.ir').replace(/\/$/, '')

  const products = new Map<string, SitemapProduct>()
  const categories = new Map<string, SitemapCategory>()

  // Prefer a dedicated backend sitemap endpoint when available.
  try {
    const res = await $fetch<SitemapResponse>(`${apiBase}/sitemap-data`)
    for (const product of res?.data?.products || []) {
      if (product?.slug) products.set(String(product.slug), product)
    }
    for (const category of res?.data?.categories || []) {
      if (category?.id != null) categories.set(String(category.id), category)
    }
  } catch {
    // Fallback below keeps the sitemap useful even if /sitemap-data is not present.
  }

  // Fallback: use the same /menu endpoint that the products page already uses.
  // It supports pagination, so collect pages until the API reports the last page.
  if (!products.size || !categories.size) {
    try {
      const categoryRes = await $fetch<{ data?: SitemapCategory[] | { categories?: SitemapCategory[] } }>(`${apiBase}/categories`)
      const raw = categoryRes?.data
      const categoryList = Array.isArray(raw) ? raw : (raw?.categories || [])
      for (const category of categoryList) {
        if (category?.id != null) categories.set(String(category.id), category)
      }
    } catch {}

    try {
      let page = 1
      const maxPages = 100
      while (page <= maxPages) {
        const res = await $fetch<SitemapResponse>(`${apiBase}/menu`, { query: { page } })
        const list = res?.data?.products || []
        for (const product of list) {
          if (product?.slug) products.set(String(product.slug), product)
        }

        const meta = res?.data?.meta || {}
        const lastPage = Number(meta.last_page ?? meta.lastPage ?? meta.total_pages ?? meta.totalPages)
        if (lastPage && page >= lastPage) break
        if (!list.length) break

        // If there is no explicit last page, stop when the API returns fewer
        // products than a normal page; this avoids an endless sitemap request.
        const perPage = Number(meta.per_page ?? meta.perPage ?? 0)
        if (!lastPage && perPage && list.length < perPage) break
        if (!lastPage && !perPage && page > 1 && list.length < 50) break
        page++
      }
    } catch {}
  }

  const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [
    { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/products`, changefreq: 'daily', priority: '0.9' }
  ]

  for (const category of categories.values()) {
    if (category.id == null) continue
    urls.push({
      loc: `${siteUrl}/products?category=${encodeURIComponent(String(category.id))}`,
      changefreq: 'daily',
      priority: '0.7'
    })
  }

  for (const product of products.values()) {
    if (!product.slug) continue
    urls.push({
      loc: `${siteUrl}/products/${encodeURIComponent(String(product.slug))}`,
      lastmod: validDate(product.updated_at),
      changefreq: 'weekly',
      priority: '0.8'
    })
  }

  const uniqueUrls = Array.from(new Map(urls.map((url) => [url.loc, url])).values())

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${uniqueUrls.map((url) => `  <url>\n    <loc>${escapeXml(url.loc)}</loc>\n${url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>\n` : ''}    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600, s-maxage=3600')
  return body
})
