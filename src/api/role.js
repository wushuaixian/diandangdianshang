import request from '@/utils/request'

const api = {
  queryAllRoleDataPage: '/ouser-web/role/queryAllRoleDataPage.do',
  saveRole: '/ouser-web/role/saveRole.do',
  getRoleById: '/ouser-web/role/getRoleById.do',
  updateRoleAndFunction: '/ouser-web/role/updateRoleAndFunction.do',
  deleteRole: '/ouser-web/role/deleteRole.do',
  updateState: '/ouser-web/role/updateState'
}

/**
 * author cdd
 * description:Role List
 * @param params
 */
export function queryAllRoleDataPage(params) {
  return request({
    url: api.queryAllRoleDataPage,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description: Save Role
 * @param params
 */
export function saveRole(params) {
  return request({
    url: api.saveRole,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description:Get Role
 * @param params
 */
export function getRoleById(params) {
  return request({
    url: api.getRoleById,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description: Update Role
 * @param params
 */
export function updateRoleAndFunction(params) {
  return request({
    url: api.updateRoleAndFunction,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description:Delete Role
 * @param params
 */
export function deleteRole(params) {
  return request({
    url: api.deleteRole,
    method: 'post',
    data: params
  })
}

/**
 * author:cdd
 * description:更新角色状态
 * @param params
 */
export function updateState(params) {
  return request({
    url: api.updateState,
    method: 'post',
    data: params
  })
}
