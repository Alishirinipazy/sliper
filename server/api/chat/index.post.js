export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { messages, productContext } = body
    return  console.log(productContext)
    const apiKey  = process.env.GAPGPT_API_KEY
    const baseURL = 'https://api.gapgpt.app/v1'

    const systemPrompt = `تو یه دستیار هوشمند اسلیپر پاز هستی به اسم «پازی».
وظیفه‌ات کمک به مشتریان در انتخاب کالا مناسب، راهنمایی سایز، و معرفی محصولات هست.

${productContext ? `اطلاعات محصول فعلی:\n${productContext}` : ''}

قوانین پاسخ:
- فارسی صحبت کن، صمیمی و مختصر
- برای انتخاب سایز: اگه سایز کفش معمولی رو بدن، همون سایز رو پیشنهاد بده
- اگه بین دو سایز هستن، سایز بزرگ‌تر رو پیشنهاد بده
- راهنمای سایز: سایزهای دمپایی معمولاً با سایز کفش یکسانه
- برای جنس‌های مختلف: مردانه (۴۰-۴۵)، زنانه (۳۶-۴۱)، بچگانه (۲۴-۳۵)
- اگه سوال خارج از حوزه فروشگاه بود، مودبانه برگرد به موضوع
- پاسخ‌ها کوتاه باشن (حداکثر ۳ جمله)
- از ایموجی استفاده کن 👟`

    try {
        const response = await $fetch(`${baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gapgpt-qwen-3.5',
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                max_tokens: 300,
                temperature: 0.7,
            })
        })

        return {
            reply: response.choices?.[0]?.message?.content ?? 'متأسفم، مشکلی پیش اومد.'
        }

    } catch (error) {
        console.error('GapGPT error:', error)
        throw createError({ statusCode: 500, message: 'خطا در اتصال به هوش مصنوعی' })
    }
})
