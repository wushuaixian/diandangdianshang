import request from '@/utils/request'
// 供应商应付商
// export function getList(params) {
//   return request({
//     url: '/back-manage-web/merchant/fee/queryAndPage',
//     method: 'get',
//     params
//   })
// }

// 查询金额
export function totalMoney(params) {
  return request({
    url: '/back-manage-web/account/performance/totalMoney',
    method: 'get',
    params
  })
}

// 平台保证金列表
export function performanceList(params) {
  return request({
    url: '/back-manage-web/account/performance/list',
    method: 'post',
    data: params
  })
}
// 保证金明细
export function performanceDetial(params) {
  return request({
    url: '/back-manage-web/account/performance/detial',
    method: 'post',
    data: params
  })
}
