
import request from '@/utils/request'

const api = {
  listPage: 'back-product-web/public/data/task/listPage?filterDataAuth=true'
}

/**
 * author cdd
 * description:Get Task data
 * @param params
 */
export function listPage(params) {
  return request({
    url: api.listPage,
    method: 'post',
    data: params
  })
}
