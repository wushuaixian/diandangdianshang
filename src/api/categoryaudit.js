import request from '@/utils/request'

const userApi = {
  // supplier: '/ouser-web/merchantOrgInfo/pageMerchantOrgInfo'
  // supplier: 'back-manage-web/category/categoryAuthPage',
  supplier: '/back-manage-web/category/sysCategoryAuthPage',
  auditCategoryList: '/back-manage-web/category/auditCategoryList'
}

export function supplierAuditList(params) {
  return request({
    url: userApi.supplier,
    method: 'post',
    data: params
  })
}
export function auditCategoryList(params) {
  return request({
    url: userApi.auditCategoryList,
    method: 'post',
    data: params
  })
}

export function getDetail(params) {
  return request({
    url: '/back-manage-web/category/categoryAuthDetail',
    method: 'get',
    params
  })
}
