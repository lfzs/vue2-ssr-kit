const isDev = process.env.APP_ENV === 'development'
module.exports = {
  plugins: [
    'autoprefixer',
    ...(isDev ? [] : ['cssnano']),
  ]
}
