export axios from './axios'
export fetchAction from './fetch-action'

export function sleep(time = 0) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// 从 error 中获取 message
export function getErrorMessage(error, defaultMessage = '请求失败, 请重试') {
  if (typeof error === 'string') return error
  return error.message || error.errMsg || error.error_message || error.error || defaultMessage
}
