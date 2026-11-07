export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    return posFetch(event, '/checkout', { method: 'POST', body })
})
