export axios from './axios'
export fetchAction from './fetch-action'

export function sleep(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 从 response 中获取 message
export function getErrorMessage(response, defaultMessage = '请求失败, 请重试') {
  return response?.message ?? defaultMessage
}
