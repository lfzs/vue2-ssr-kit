import dayjs from 'dayjs'

export const formatTime = (time, unit = 'YYYY-MM-DD HH:mm:ss') => {
  const T = dayjs(time)
  return T.isValid() ? T.format(unit) : time
}
