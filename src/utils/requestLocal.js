import axios from 'axios'
// import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import router from '@/router'
import { cleanLoginInfo } from '@/utils/auth'

// 创建 axios 实例
const requestVR = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_VR_URL,
  timeout: 6000 // 请求超时时间
})
// 创建 axios 实例
const requestM = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_VR_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = error => {
  if (error.response) {
    // const data = error.response.data
    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN)
    // if (error.response.status === 403) {
    //   notification.error({
    //     message: 'Forbidden',
    //     description: data.message
    //   })
    // }
    // if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
    //   notification.error({
    //     message: 'Unauthorized',
    //     description: 'Authorization verification failed'
    //   })
    //   if (token) {
    //     store.dispatch('Logout').then(() => {
    //       setTimeout(() => {
    //         window.location.reload()
    //       }, 1500)
    //     })
    //   }
    // }
  }
  return Promise.reject(error)
}

// request interceptor
requestVR.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['X-Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
requestVR.interceptors.response.use(async response => {
  const {
    data: { code, message }
  } = response
  if (code === '0') {
    return response.data
  } else {
    if (code === '99') {
      cleanLoginInfo()
      router.replace('/user/login')
    }
    notification.error({
      message: '提示',
      description: message
    })
  }
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, requestVR)
  }
}

export { requestVR, requestM }
export { installer as VueAxios, requestVR as axios }
