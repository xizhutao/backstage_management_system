import request from '@/utils/request'
/** *
 *
 * 获取组织架构数据
 * **/
export function getDepartments () {
  return request({
    url: '/company/department'
  })
}
/**
 * 根据部门id删除
 * @param {*} id
 * @returns
 */
export const delDepartment = id => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}
/**
 * 新增部门
 * @param code 编码
 * @returns
 */
export const addDepartment = ({ code, introduce, manager, name, pid }) => {
  return request({
    method: 'POST',
    url: '/company/department',
    data: { code, introduce, manager, name, pid }
  })
}
/**
 * 根据部门id编辑部门
 * @param {*} id
 * @returns
 */
export const editDepartment = id => {
  return request({
    method: 'GET',
    url: `/company/department/${id}`
  })
}
/**
 * 根据部门id修改部门
 * @param {*} id
 * @returns
 */
export const editDepartmentDetail = (id, data) => {
  return request({
    method: 'PUT',
    url: `/company/department/${id}`,
    data
  })
}
/** *
 *  封装一个导入员工的接口
 *
 * ***/

export function importEmployee (data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
