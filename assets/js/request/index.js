import axios from 'axios'
import { addAuthInterceptors } from '../auth'
import { camelize } from '@/assets/js/utils/convert-to-camel-snake'

const createPureInstance = (baseUrl, { headers, ...configs } = {}) => {
  return axios.create({
    timeout: 15000,
    baseURL: baseUrl,
    headers: {
      ...(headers || {})
    },
    ...configs
  })
}

const addCamelizeInterceptor = (instance) => {
  instance.interceptors.response.use(
    (res) => {
      if (res.data) return camelize(res.data)
      return data
    },
    (e) => {
      return Promise.reject(e)
    }
  )
}

export const createRequestInstance = (baseUrl, configs = {}, token = null) => {
  const instance = createPureInstance(baseUrl, configs)
  addAuthInterceptors(instance, token)
  addCamelizeInterceptor(instance)
  return instance
}
