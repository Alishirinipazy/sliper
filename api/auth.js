export const apiLogin = (request, data, config = {}) => {
    return request.post(`/auth/login`, data, config)
}
export const apiCheckOTP = (request, data, config = {}) => {
    return request.post(`/auth/check-otp`, data, config)
}
