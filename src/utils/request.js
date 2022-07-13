import axios from 'axios'
export const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
