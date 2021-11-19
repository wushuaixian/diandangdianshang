import request from '@/utils/request'

const api = {
  getAllRoleFunctionByPlatformAndRoleId: '/ouser-web/function/getAllRoleFunctionByPlatformAndRoleId.do',
  getAllUserFunctionByRoleIds: '/ouser-web/function/getAllUserFunctionByRoleIds.do'
}

/**
 * author cdd
 * description:All Role List
 * @param params
 */
export function getAllRoleFunctionByPlatformAndRoleId(params) {
  return request({
    url: api.getAllRoleFunctionByPlatformAndRoleId,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description:role preview
 * @param params
 */
export function getAllUserFunctionByRoleIds(params) {
  return request({
    url: api.getAllUserFunctionByRoleIds,
    method: 'post',
    data: params
  })
}
