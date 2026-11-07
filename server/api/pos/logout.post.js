export default defineEventHandler((event) => {
    deleteCookie(event, POS_COOKIE, { path: '/' })
    return { ok: true }
})
