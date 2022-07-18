import request from '@/utils/request'
/**
 *获取角色列表
 * @param {*} params
 * @returns
 */
export const getRoleList = (params) => {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}
/**
 *添加角色
 * @param {*} params
 * @returns
 */
export const addRole = (data) => {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}
/**
 *删除角色
 * @param {*} params
 * @returns
 */
export const deleteRole = (id) => {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}
/**
 * 获取公司信息
 * **/
export function getCompanyInfo (companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

