import request from '@/utils/request'

export function queryFInanceInfoByMerchantId(params) {
  return request({
    url: '/back-manage-web/financeInfo/queryFinanceInfoByMerchantId',
    method: 'get',
    params
  })
}
export function saveLogoUrl(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/uploadLogoUrl',
    method: 'get',
    params
  })
}
export function checkFinanceInfo(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/checkFinanceInfo',
    method: 'get',
    params
  })
}
export function getGrade(params) {
  return request({
    url: 'back-manage-web/supplier/score/getGrade',
    method: 'get',
    params
  })
}
