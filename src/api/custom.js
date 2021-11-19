import request from '@/utils/request'
// 供应商应付商
export function getList(params) {
  return request({
    url: '/back-manage-web/merchant/fee/queryAndPage',
    method: 'post',
    data: params
  })
}

// 作废
export function updataBillStatus(params) {
  return request({
    url: '/back-manage-web/merchant/fee/updataBillStatus',
    method: 'post',
    data: params
  })
}

// 生成付款单
export function paymentCreate(params) {
  return request({
    url: '/back-manage-web/merchant/payment/create',
    method: 'post',
    data: params
  })
}

// 收款单位模糊查询
export function queryMerchantLikeName(params) {
  return request({
    url: '/back-manage-web/merchant/fee/queryMerchantLikeName',
    method: 'get',
    params
  })
}
