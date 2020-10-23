import axios from 'axios'
import { getErrorMessage } from '@/util'
import { baseURL } from '@/env'
import { authStore } from '@/store'
import { Message } from 'element-ui'
axios.defaults.baseURL = baseURL
axios.defaults.timeout = 60000

axios.interceptors.request.use(handleRequest)
axios.interceptors.response.use(handleResponse, handleResponseError)

function handleRequest(request) {
  return request
}

function handleResponse(response) {
  // 2xx 拦截
  return response
}

async function handleResponseError(error) {
  // 非 2xx 拦截

  if (process.env.browser) {
    const { response: { data, status }, config: { showErrorToast = true } } = error // showErrorToast：请求出错是否需要 toast 提示

    if (status === 401) {
      authStore.setNext(location.href)
      await $app.$router.replace({ path: 'signin' })
    } else {
      showErrorToast && Message.error({ message: getErrorMessage(data.error_message) })
    }
  }

  return Promise.reject(error)
}

export default axios
