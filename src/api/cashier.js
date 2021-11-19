import request from '@/utils/request'

// 收银台信息
export function getScenePaymentConuterList (params) {
  return request({
    url: '/back-manage-web/scenePaymentCounter/getScenePaymentConuterList',
    method: 'get',
    params: params
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'
    // }
  })
}

// 充值申请
export function depositApply (params) {
  return request({
    url: '/back-manage-web/recharge/depositApply',
    method: 'post',
    data: params
  })
}

// 除了充值外都用此接口
export function orderCreate (params) {
  return request({
    url: '/back-manage-web/payment/order/create',
    method: 'post',
    data: params
  })
}
