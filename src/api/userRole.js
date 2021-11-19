import request from '@/utils/request'

const api = {
  batchUpdateUserRole: '/ouser-web/userRole/batchUpdateUserRole.do'
}

/**
 * author cdd
 * description:Update Role
 * @param params
 */
export function batchUpdateUserRole(params) {
  return request({
    url: api.batchUpdateUserRole,
    method: 'post',
    data: params
  })
}
