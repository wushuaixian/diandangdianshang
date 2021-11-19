import request from '@/utils/request'

export function listProgress(params) {
  return request({
    url: '/appdflow-web/flow/listProgress',
    method: 'get',
    params
  })
}
export function getById(params) {
  return request({
    url: '/appdflow-web/afProcess/getById',
    method: 'get',
    params
  })
}
