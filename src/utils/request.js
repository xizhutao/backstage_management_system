import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})
// 请求拦截器为有权限的接口统一注入token
request.interceptors.request.use((config) => {
  // 对请求的配置项进行处理
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器进行错误处理
request.interceptors.response.use(response => {
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error.message)
})

export default request
