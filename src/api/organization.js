/*
 * @Author: your name
 * @Date: 2021-07-02 22:31:11
 * @LastEditTime: 2021-07-15 16:25:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/organization.js
 */
import request from '@/utils/request'

export function queryDepartmentList(params) {
  return request({
    url: '/ouser-web/department/organizeList',
    method: 'post',
    data: params
  })
}

export function addDepartment(params) {
  return request({
    url: '/ouser-web/department/add.do',
    method: 'post',
    data: params
  })
}
export function deleteDepartment(params) {
  return request({
    url: '/ouser-web/department/delete.do',
    method: 'post',
    data: params
  })
}
export function getCategoryList(params = { category: 'DEPARTMENT_TYPE', pool: 'ouser' }) {
  return request({
    url: '/ouser-web/public/config/select',
    method: 'get',
    params
  })
}

export function updateDepartment(params) {
  return request({
    url: '/ouser-web/department/update.do',
    method: 'post',
    data: params
  })
}
export function queryEmployeePageByIdentityType(params) {
  return request({
    // url: '/ouser-web/employee/queryEmployeePageByIdentityType.do',
    url: '/ouser-web/employee/queryUserPage',
    method: 'post',
    data: params
  })
}
export function updateEmployeeStatus(params) {
  return request({
    url: '/ouser-web/employee/updateEmployeeStatus.do',
    method: 'post',
    data: params
  })
}
export function batchDeleteDepartmentUser(params) {
  return request({
    url: '/ouser-web/department/batchDeleteDepartmentUser.do',
    method: 'post',
    data: params
  })
}
export function queryEmployeeForDepartment(params) {
  return request({
    url: '/ouser-web/employee/queryEmployeeForDepartmentByType.do',
    method: 'post',
    data: params
  })
}
export function listByUsername(params) {
  return request({
    url: '/ouser-web/department/listByUsername.do',
    method: 'post',
    data: params
  })
}
export function batchAddDepartmentUser(params) {
  return request({
    url: '/ouser-web/department/batchAddDepartmentUser.do',
    method: 'post',
    data: params
  })
}
export function openIsCharge(params) {
  return request({
    url: '/ouser-web/department/openIsCharge.do',
    method: 'post',
    data: params
  })
}
