import request from '@/utils/request'

export function getTaskList(params) {
  return request({
    url: '/appdflow-web/afTask/listPage',
    method: 'post',
    data: params
  })
}
export function getCountList(params) {
  return request({
    url: '/appdflow-web/afTask/countByAuditStatus',
    method: 'post',
    data: params
  })
}
export function audit(params) {
  return request({
    url: '/appdflow-web/afTask/audit',
    method: 'post',
    data: params
  })
}
