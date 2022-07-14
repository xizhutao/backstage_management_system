import request from '@/utils/request'
/**
 * 登录
 * @param {*} data
 * @returns
 */
export function handlelogin (data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}
/**
 *获取用户信息
 * @returns
 */
export function getUserInfo () {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}
/**
 *获取用户详细信息
 * @returns
 */
export function getDetailInfoById (id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout () {

}
