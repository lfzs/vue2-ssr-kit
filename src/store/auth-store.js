export default new class {

  #next = '' // 登陆成功后需要跳转的页面
  setNext(path) {
    this.#next || (this.#next = path)
  }

  signinNext() {
    this.#next ? (location.href = this.#next) : $app.$router.replace({ path: '/' })
  }

  signin({ mobile = '', password = '' }) {
    return $app.$axios.post('sessions/login_with_password', { mobile, password })
  }
}
