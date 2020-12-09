export default function(target, name, descriptor) { // target 为类的原型对象
  const { value } = descriptor
  if (typeof value !== 'function') throw new Error(`${name} is not a function`)

  target.tryFetchData = function(...args) { return this._state === 'done' ? { data: this.data } : this.fetchData(...args) } // 注意: 请求过，就返回已有的数据 data

  descriptor.value = async function(...args) {
    this._state = 'pending'
    try {
      const res = await value.apply(this, args)
      this._state = 'done'
      return this.data = res.data ?? res // 注意: res.data 有值就拿 data 否则拿 res
    } catch (error) {
      this._state = 'error'
      throw error
    }
  }
}
