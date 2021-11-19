import request from '@/utils/request'

export function getDetail(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/examineDetail',
    method: 'get',
    params
  })
}
