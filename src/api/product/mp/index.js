import request from '@/utils/request'

export function listRootCategoryBack(params) {
  return request({
    url: '/back-product-web/back/mp/category/listRootCategoryBack.do',
    method: 'post',
    data: params
  })
}
