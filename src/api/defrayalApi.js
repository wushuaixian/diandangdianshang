import request from '@/utils/request'
const userApi = {
  // 刷新支付二维码接口
  orderDefraya: '/back-manage-web/payment/order/refreshQRcode',
  order: '/back-manage-web/payment/order/create'
}
export function orderDefraya(params) {
  return request({
    url: userApi.orderDefraya,
    method: 'get',
    params
  })
}
export function order(params) {
  return request({
    url: userApi.order,
    method: 'post',
    data: params
  })
}
