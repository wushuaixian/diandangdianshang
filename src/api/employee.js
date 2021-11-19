import request from '@/utils/request'

const api = {
  queryUserOperate: '/ouser-web/employee/queryUserOperate',
  addUserOperate: '/ouser-web/employee/addUserOperate',
  positionList: '/ouser-web/employee/positionList',
  asyncImport: '/ouser-web/employee/asyncImport.do',
  resetPassword: 'ouser-web/employee/resetPassword.do'
}

/**
 * author cdd
 * description:All Role List
 * @param params
 */
export function queryUserOperate(params) {
  return request({
    url: api.queryUserOperate,
    method: 'get',
    params: params
  })
}

/**
 * author cdd
 * description:Add user
 * @param params
 */
export function addUserOperate(params) {
  return request({
    url: api.addUserOperate,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description:Get position
 * @param params
 */
export function positionList(params) {
  return request({
    url: api.positionList,
    method: 'get',
    params: params
  })
}

export function asyncImport(formData) {
  return request({
    url: api.asyncImport,
    method: 'post',
    processData: false,
    data: formData
  })
}

/**
 * author:cdd
 * description:Reset password
 * @param params
 */
export function resetPassword(params) {
  return request({
    url: api.resetPassword,
    method: 'post',
    data: params
  })
}
