export default defineEventHandler(async (event) => {
    const { public: { apiBase, siteUrl } } = useRuntimeConfig()

    let products: { slug: string; updated_at: string }[] = []
    let categories: { id: number; name: string }[] = []

    try {
        const res = await $fetch<{ data: { products: typeof products; categories: typeof categories } }>(
            `${apiBase}/sitemap-data`
        )
        products = res.data.products
        categories = res.data.categories
    } catch {
        // If the backend is briefly unreachable, still serve a sitemap with
        // the static pages below instead of failing the whole request.
    }

    const staticUrls = [
        { loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0' },
        { loc: `${siteUrl}/products`, changefreq: 'daily', priority: '0.9' },
    ]

    const categoryUrls = categories.map((c) => ({
        loc: `${siteUrl}/products?category=${c.id}`,
        changefreq: 'daily',
        priority: '0.7',
    }))

    const productUrls = products.map((p) => ({
        loc: `${siteUrl}/products/${p.slug}`,
        lastmod: p.updated_at?.slice(0, 10),
        changefreq: 'weekly',
        priority: '0.8',
    }))

    const allUrls = [...staticUrls, ...categoryUrls, ...productUrls]

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
    .map(
        (u) => `  <url>
    <loc>${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ''}    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
    )
    .join('\n')}
</urlset>`

    setResponseHeader(event, 'Content-Type', 'application/xml')
    return body
})
