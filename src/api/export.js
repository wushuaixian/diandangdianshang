import request from '@/utils/request'

export function exportFile(params) {
  return request({
    url: '/back-manage-web/back/mp/asyncTask/asyncEvent',
    method: 'post',
    data: params
  })
}
