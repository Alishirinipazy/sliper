# Sitemap deployment

`/sitemap.xml` is handled by Nitro middleware so an old/static sitemap cannot silently win inside the Nuxt app.

After deployment open `https://slipperpaz.ir/sitemap.xml`. The response must contain real XML beginning with `<?xml version="1.0" encoding="UTF-8"?>` and a `<urlset>` root.

If the old plain-text response remains, the hosting layer (Apache/Nginx/CDN) is serving an old sitemap before Nuxt. Delete/rename that old root/static `sitemap.xml`, restart the Nuxt process, and clear the CDN cache.
