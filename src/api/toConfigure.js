import request from '@/utils/request'
// 获取采购商接口
export function getSupplierMerchant () {
  return request({
    url: '/back-manage-web/merchant/getSupplierMerchant',
    method: 'post'
  })
}
// 物料类目接口
export function materialcategoryAll (params) {
  return request({
    url: '/back-manage-web/materialcategory/all',
    method: 'get',
    params: params
  })
}
// 物料明细接口
export function materialPage (params) {
  return request({
    url: '/back-manage-web/material/page',
    method: 'post',
    data: params
  })
}
// 采购员确认
export function buyerAllot (params) {
  return request({
    url: '/back-manage-web/buyer/allot',
    method: 'post',
    data: params
  })
}
