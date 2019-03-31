import Vue from 'vue'
import store from '../store/index'
import i18n from '../common/i18n'
import axios from 'axios'
import { Loading, Message } from 'element-ui'
import { BASE_URL } from '@/common/static'
import { dater, isEmpty, Storage, refreshToken, has } from '@/common/utils'

let loading
const token = new Storage('TOKEN')

axios.defaults.baseURL = BASE_URL

function checkAuth (options) {
  const tokenInfo = token.get({})
  return new Promise((resolve, reject) => {
    const isLogin = has(options.url, '/oauth2/v2.0/token')
    if (isEmpty(tokenInfo) && !isLogin) {
      store.commit('UPDATE_STATE', {shouldLogin: true})
      loading && loading.close()
      reject(new Error('expired'))
    } else if (tokenInfo.expires_time < dater().format('X') && !isLogin) {
      refreshToken(tokenInfo.refresh_token).then(res => {
        token.set(res)
        store.commit('UPDATE_STATE', {token: res})
        options.headers.Authorization = `Bearer ${res.access_token}`
        axios(options).then(resolve)
      }).catch(() => {
        loading.close()
      })
    } else {
      axios(options).then(resolve)
    }
  })
}

export const post = (url, data, options) => {
  return common('POST', url, data, options)
}

export const get = (url, data, options) => {
  return common('GET', url, data, options)
}

export const patch = (url, data, options) => {
  return common('PATCH', url, data, options)
}

export const common = (type, url, data, options = {}) => {
  const tokenInfo = token.get({})
  if (typeof url === 'object') {
    const request = url
    url = request.url
    data = request.data
    options = request.options || {}
  }

  options = Object.assign({
    showLoading: true,
    quite: false
  }, options)

  if (options.showLoading) {
    loading = Loading.service({
      lock: true,
      text: i18n.t('base.loading'),
      background: 'rgba(0, 0, 0, 0.7)'
    })
  }

  // 设置默认值
  options = Object.assign({
    url,
    method: type,
    dataType: 'json',
    withCredentials: true,
    // 显示loading
    process: true,
    // 超时时间
    timeout: 15000,
    // 是否需要提示
    headers: {
      Authorization: `Bearer ${tokenInfo.access_token}`,
      Prefer: `outlook.timezone="${Intl.DateTimeFormat().resolvedOptions().timeZone}"`,
      'content-type': 'application/json;charset=utf-8'
    }
  }, options)

  // 根据请求类型修改数据传输结构
  if (type.toLowerCase() === 'get') options.params = data
  else options.data = data

  return checkAuth(options)
}

axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  loading && loading.close()
  return response.data || {}
}, function (error) {
  loading && loading.close()
  if (!error.config.quite) {
    Message.error(error.message)
  }
  if (error.response.status === 401) {
    store.commit('UPDATE_STATE', {shouldLogin: true})
  }
  return Promise.reject(error)
})

Vue.use(Vue => {
  Vue.prototype.$get = get
  Vue.prototype.$post = post
  Vue.prototype.$patch = patch
  Vue.prototype.$fetch = common
})
