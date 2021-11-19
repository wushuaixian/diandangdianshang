/* eslint-disable eol-last */
/* eslint-disable spaced-comment */
import request from '@/utils/request'

//获取表格数据
export function getReceipt(params) {
  return request({
    url: '/back-manage-web/operation/receipt/queryOperationReceiptList',
    method: 'post',
    data: params
  })
}
//收款单详情
export function receiptDetailsID(id) {
  return request({
    url: `/back-manage-web/operation/receipt/queryOperationReceiptDetails?id=${id}`,
    method: 'get'
  })
}

//确认收款
export function updateBillStatusById(params) {
  return request({
    url: '/back-manage-web/operation/receipt/updateBillStatusById',
    method: 'post',
    data: params
  })
}
//确认
export function addInvoice(params) {
  return request({
    url: '/back-manage-web/findInvoice/addInvoice',
    method: 'post',
    data: params
  })
}
// //作废的接口
// export function voidas(params) {
//   return request({
//     url: '/back-manage-web/findInvoice/nullify',
//     method: 'POST',
//     data: params
//   })
//   // eslint-disable-next-line eol-last
// }
// //发票详情
// export function details(params) {
//   return request({
//     url: '/back-manage-web/findInvoice/findInfo',
//     method: 'get',
//     params
//   })
// }
// //  供应商付款单
// export function Payment(params) {
//   return request({
//     url: '/back-manage-web/merchant/payment/queryPaymentList',
//     method: 'get',
//     params
//   })
// }
