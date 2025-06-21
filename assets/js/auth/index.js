export const addAuthInterceptors = (instance, token) => {
  instance.interceptors.request.use(
    (config) => {
      return {
        ...config,
        headers: {
          ...(config?.headers || {}),
          Authorization: token ? `Bearer ${token}` : ''
        }
      }
    },
    null,
    { synchronous: true }
  )
}
  