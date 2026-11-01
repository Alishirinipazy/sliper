// دایرکتیو v-reveal: المان وقتی وارد صفحه می‌شود با افکت ظاهر می‌شود.
// - روی سرور هیچ کلاسی نمی‌گذارد، پس بدون جاوااسکریپت هم محتوا دیده می‌شود.
// - المانی که از اول داخل صفحه است، مخفی نمی‌شود (پرش بصری ندارد).
export default defineNuxtPlugin((nuxtApp) => {
    let observer = null

    const getObserver = () => {
        if (observer || typeof IntersectionObserver === 'undefined') return observer
        observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue
                entry.target.classList.add('is-visible')
                observer.unobserve(entry.target)
            }
        }, {threshold: 0.12, rootMargin: '0px 0px -8% 0px'})
        return observer
    }

    nuxtApp.vueApp.directive('reveal', {
        mounted(el, binding) {
            const io = getObserver()
            if (!io) return
            const rect = el.getBoundingClientRect()
            if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) return // already on screen
            if (typeof binding.value === 'number') el.style.setProperty('--reveal-delay', `${binding.value}ms`)
            el.classList.add('reveal')
            io.observe(el)
        },
        unmounted(el) {
            observer?.unobserve(el)
        },
        getSSRProps: () => ({}),
    })
})
