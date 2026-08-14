/** Force /sitemap.xml through Nitro before any legacy/static sitemap. */
type Product = { slug?: string; updated_at?: string | null; updatedAt?: string | null }

function xmlEscape(value: unknown) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
function dateOnly(value?: string | null) {
  if (!value) return undefined
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10)
}
function unwrapList(value: any): any[] {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.data?.data)) return value.data.data
  if (Array.isArray(value?.data?.products)) return value.data.products
  if (Array.isArray(value?.products)) return value.products
  return []
}

export default defineEventHandler(async (event) => {
  if (event.path !== '/sitemap.xml') return

  const config = useRuntimeConfig(event)
  const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')
  const siteUrl = String(config.public.siteUrl || 'https://slipperpaz.ir').replace(/\/$/, '')
  const products = new Map<string, Product>()
  const categories = new Set<string>()

  if (apiBase) {
    try {
      const result: any = await $fetch(`${apiBase}/sitemap-data`, { timeout: 8000 })
      for (const p of unwrapList(result?.data?.products ?? result?.products)) if (p?.slug) products.set(String(p.slug), p)
      for (const c of unwrapList(result?.data?.categories ?? result?.categories)) if (c?.id != null) categories.add(String(c.id))
    } catch {}
    try {
      const result: any = await $fetch(`${apiBase}/categories`, { timeout: 8000 })
      for (const c of unwrapList(result)) if (c?.id != null) categories.add(String(c.id))
    } catch {}
    for (let page = 1; page <= 100; page++) {
      try {
        const result: any = await $fetch(`${apiBase}/menu`, { query: { page }, timeout: 8000 })
        const list = unwrapList(result)
        for (const p of list) if (p?.slug) products.set(String(p.slug), p)
        const meta = result?.data?.meta ?? result?.meta ?? {}
        const lastPage = Number(meta.last_page ?? meta.lastPage ?? meta.total_pages ?? meta.totalPages)
        if (lastPage && page >= lastPage) break
        if (!list.length) break
        const perPage = Number(meta.per_page ?? meta.perPage ?? 0)
        if (!lastPage && perPage && list.length < perPage) break
        if (!lastPage && !perPage && list.length < 50) break
      } catch { break }
    }
  }

  const urls: Array<{ loc: string; lastmod?: string; changefreq: string; priority: string }> = [
    { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${siteUrl}/products`, changefreq: 'daily', priority: '0.9' }
  ]
  for (const id of categories) urls.push({ loc: `${siteUrl}/products?category=${encodeURIComponent(id)}`, changefreq: 'daily', priority: '0.7' })
  for (const product of products.values()) {
    const slug = String(product.slug || '')
    if (!slug) continue
    urls.push({ loc: `${siteUrl}/products/${encodeURIComponent(slug)}`, lastmod: dateOnly(product.updated_at ?? product.updatedAt), changefreq: 'weekly', priority: '0.8' })
  }

  const unique = Array.from(new Map(urls.map(item => [item.loc, item])).values())
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...unique.map(item => [
      '  <url>',
      `    <loc>${xmlEscape(item.loc)}</loc>`,
      item.lastmod ? `    <lastmod>${item.lastmod}</lastmod>` : '',
      `    <changefreq>${item.changefreq}</changefreq>`,
      `    <priority>${item.priority}</priority>`,
      '  </url>'
    ].filter(Boolean).join('\n')),
    '</urlset>'
  ].join('\n')

  setResponseHeader(event, 'Content-Type', 'application/xml; charset=UTF-8')
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff')
  setResponseHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  setResponseHeader(event, 'X-Sitemap-Source', 'slipperpaz-nitro')
  return body
})
