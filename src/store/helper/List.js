import Cache from './Cache'

export default class extends Cache {
  data = []

  state = 'pending'
  meta = { total: 0, pageSize: 20 }

  api = ''
  param = {}

  async fetchData() {
    this.state = 'pending'
    try {
      const { data, meta } = await $app.$axios.get(this.api, { params: { offset: 1, pageSize: this.meta.pageSize, ...this.param } })
      this.data = data ?? this.data
      this.meta = meta ?? this.meta
      this.state = 'done'
    } catch (error) {
      this.state = 'error'
      throw error
    }
  }

  tryFetchData() {
    return this.state !== 'done' && this.fetchData()
  }

  async fetchMoreData() {
    if (this.state === 'pending') return
    if (!this.canLoadmore) return

    this.state = 'pending'
    try {
      const { data, meta } = await $app.$axios.get(this.api, { params: { offset: this.data.length, pageSize: this.meta.pageSize, ...this.param } })
      this.data.push(...data)
      this.meta = meta
      this.state = 'done'
    } catch (error) {
      this.state = 'error'
      throw error
    }
  }

  findItemById(id) {
    return this.data.find(item => item.id === +id)
  }

  findIndexById(id) {
    return this.data.findIndex(item => item.id === +id)
  }

  removeItemById(id) {
    const index = this.findIndexById(id)
    if (index > -1) {
      this.data.splice(index, 1)
      this.meta.total -= 1
    }
  }

  replaceItem(newItem) {
    const index = this.data.findIndex(item => item.id === newItem.id)
    if (index > -1) this.data.splice(index, 1, newItem)
  }

  unshiftOrUpdate(newItem) {
    const index = this.data.findIndex(item => +item.id === +newItem.id)
    if (index > -1) {
      this.data.splice(index, 1, newItem)
    } else {
      this.data.unshift(newItem)
      this.meta.total += 1
    }
  }

  get listStatus() {
    return {
      isNoMore: this.state === 'done' && this.data.length >= this.meta.total,
      isLoading: this.state === 'pending',
      isEmpty: this.state !== 'pending' && !this.data.length,
    }
  }

  get canLoadmore() {
    return this.state === 'done' && this.data.length < this.meta.total
  }
}
