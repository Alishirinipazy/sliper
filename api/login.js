export const apiLogin = (request, data, config = {}) => {
    return request.post(`/login/auth/login`, data, config)
}