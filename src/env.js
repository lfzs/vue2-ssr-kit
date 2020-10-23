const env = {
  development: {
    host: '',
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
