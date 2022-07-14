import request from '@/utils/request'

export function handlelogin (data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

export function getInfo (token) {

}

export function logout () {

}
