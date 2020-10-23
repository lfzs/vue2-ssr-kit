const env = {
  development: {
    host: 'http://0.0.0.0:8080',
  },
  staging: {
    host: '',
  },
  production: {
    host: '',
  },
}

export const { host } = env[process.env.APP_ENV]
export const baseURL = `${host}/app/api/v1`
