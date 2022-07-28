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
/** *
 * 修改角色
 * ***/
export function updateRole (data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
/**
 * 获取角色详情
 * **/
export function getRoleDetail (id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/** *
 * 新增角色
 * ***/
export function addRole (data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
// 给角色分配权限
export function assignPerm (data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
