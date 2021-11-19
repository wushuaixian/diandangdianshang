import request from '@/utils/request'

export function queryArea(params) {
  return request({
    url: '/ouser-web/area/queryArea.do',
    method: 'get',
    params
  })
}
