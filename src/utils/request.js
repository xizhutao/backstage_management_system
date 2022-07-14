import router from '@/router'
import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 50000
})
// 请求拦截器为有权限的接口统一注入token
request.interceptors.request.use((config) => {
  // 对请求的配置项进行处理
  if (store.getters.token) {
    if (isOverTime()) { // token超时
      store.commit('user/removeToken') // 清除vuex中的token 以及缓存
      // 跳转登录页面
      router.push('/login')
      // 更改Promise状态，返回一个错误对象
      return Promise.reject(new Error('token失效'))
    }
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.commit('user/removeToken') // 清除vuex中的token 以及缓存
    // 跳转登录页面
    router.push('/login')
  } else {
    Message.error(error.message)
  }
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
const deadline = 360000000 // 失效时间
const isOverTime = () => {
  const currentTime = Date.now()
  const tokenTimeStamp = getTimeStamp()
  return (currentTime - tokenTimeStamp) / 1000 > deadline // 超时条件
}
export default request
