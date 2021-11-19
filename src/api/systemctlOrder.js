import request from '@/utils/request'
// 平台侧订单列表
export function systemctlOrderList (params) {
  return request({
    url: '/oms-web/so/quyerOrderListPage',
    method: 'post',
    data: params
  })
}
// 平台侧订单列表详情
export function systemctlOrderListDetails (params) {
  return request({
    url: '/oms-web/so/getSoDetail',
    method: 'post',
    data: params
  })
}
// so/quyerOrderLineListPage
// 平台侧订单列表详情
export function quyerOrderLineListPage (params) {
  return request({
    url: '/oms-web/so/quyerOrderLineListPage',
    method: 'post',
    data: params
  })
}
