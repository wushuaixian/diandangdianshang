import request from '@/utils/request'

export function getList (params) {
  return request({
    // url: '/back-manage-web/category/categoryAuthPage',
    url: '/back-manage-web/category/sysCategoryAuthPage',
    method: 'post',
    data: params
  })
}
