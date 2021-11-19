
import request from '@/utils/request'

const api = {
  getAsyncEventList: '/ouser-web/asyncexport/getAsyncEventList.do'
}

/**
 * author cdd
 * description:Get Task ata
 * @param params
 */
export function getAsyncEventList(params) {
  return request({
    url: api.getAsyncEventList,
    method: 'get',
    params: params
  })
}
