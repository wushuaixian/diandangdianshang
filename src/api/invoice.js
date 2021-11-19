import request from '@/utils/request'

// 获取表格数据
export function getList (params) {
  return request({
    url: '/back-manage-web/findInvoice/example',
    method: 'POST',
    data: params
  })
}

// 申请开票数据
export function applys (params) {
  return request({
    url: '/back-manage-web/findInvoice/applyBilling',
    method: 'get',
    params
  })
}
// 作废的接口
export function voidas (params) {
  return request({
    url: '/back-manage-web/findInvoice/nullify',
    method: 'POST',
    data: params
  })
}
// 发票详情
export function details (params) {
  return request({
    url: '/back-manage-web/findInvoice/findInfo',
    method: 'get',
    params
  })
}
//  供应商付款单
export function Payment (params) {
  return request({
    url: '/back-manage-web/merchant/payment/queryPaymentList',
    method: 'POST',
    data: params
  })
}
// 申请开票提交
export function submitBilling (params) {
  return request({
    url: '/back-manage-web/findInvoice/submitBilling',
    method: 'POST',
    data: params
  })
}
// 重开发票
export function resetApplyBilling (params) {
  return request({
    url: '/back-manage-web/findInvoice/resetApplyBilling',
    method: 'POST',
    data: params
  })
}
// 平台开票
export function clickBilling (params) {
  return request({
    url: '/back-manage-web/findInvoice/clickBilling',
    method: 'get',
    params
  })
}
// 地址
export function findSon (params) {
  return request({
    url: '/back-manage-web/area/findSon',
    method: 'get',
    params
  })
}
// 地址判断
export function areaName (params) {
  return request({
    url: '/back-manage-web/area/areaName',
    method: 'get',
    params
  })
}
// 付款单审核 /merchant/payment/queryDetailPageByPaymentBillCode
export function BillCode (params) {
  return request({
    url: '/back-manage-web/merchant/payment/queryDetailPageByPaymentBillCode',
    method: 'get',
    params
  })
}
// 提交开票
export function billing (params) {
  return request({
    url: '/back-manage-web/findInvoice/billing',
    method: 'POST',
    data: params
  })
}
// 开票重开
export function resetBilling (params) {
  return request({
    url: '/back-manage-web/findInvoice/resetBilling',
    method: 'POST',
    data: params
  })
}
// 去付款 /operation/receipt/create
export function create (params) {
  return request({
    url: '/back-manage-web/operation/receipt/create',
    method: 'POST',
    data: params
  })
}
// 去付款详情 /operation/receipt/create
export function PaymentDetails (params) {
  return request({
    url: '/back-manage-web/merchant/payment/queryDetailPageByPaymentBillCode',
    method: 'get',
    params
  })
}
// 付款记录 /merchant/payment/queryPaymentNoteFlowList
export function FlowLis (params) {
  return request({
    url: '/back-manage-web/merchant/payment/queryPaymentNoteFlowList',
    method: 'post',
    data: params
  })
}
// 提现查询银行卡和余额 accountManage/verifyPassword
export function select (params) {
  return request({
    url: '/back-manage-web/withdraw/select',
    method: 'get',
    params
  })
}
// 密码的接口  accountManage/verifyPassword
export function verifyPassword (params) {
  return request({
    url: '/back-manage-web/accountManage/verifyPassword',
    method: 'POST',
    data: params
  })
}
// 提现查询手机号
export function queryPhoneNo (params) {
  return request({
    url: '/back-manage-web/accountManage/queryPhoneNo',
    method: 'get',
    params
  })
}
// 提现验证码 accountManage/sendVerificationCode
export function preProcessor (params) {
  return request({
    url: '/back-manage-web/withdraw/preProcessor',
    method: 'POST',
    data: params
  })
}
// 确认提现
export function confirm (params) {
  return request({
    url: '/back-manage-web/withdraw/confirm',
    method: 'POST',
    data: params
  })
}
// 生成收款单
export function receiptCreate (params) {
  return request({
    url: '/back-manage-web/operation/receipt/create',
    method: 'POST',
    data: params
  })
}
// 缴纳保证金 account/depositAndDepositUper
export function depositAndDepositUper (params) {
  return request({
    url: '/back-manage-web/account/depositAndDepositUper',
    method: 'get',
    params
  })
}
// 生成付款单 /merchant/fee/create
export function feeCreate (params) {
  return request({
    url: '/back-manage-web/merchant/fee/create',
    method: 'POST',
    data: params
  })
}
// 线下支付申请 /payManage/generatePaymentOrder
export function generatePaymentOrdere (params) {
  return request({
    url: '/back-manage-web/payManage/generatePaymentOrder',
    method: 'POST',
    data: params
  })
}
// 平台保证金列表
export function performanceList (params) {
  return request({
    url: '/back-manage-web/account/performance/list',
    method: 'POST',
    data: params
  })
}
// 新增发票查询信息（谈框）
export function invoicePayment (params) {
  return request({
    url: '/back-manage-web/findInvoice/payment',
    method: 'get',
    params
  })
}
// 滑过显示物流信息
export function newOrderMessage (params) {
  return request({
    url: '/back-manage-web/findInvoice/expressTrack',
    method: 'POST',
    data: params
  })
}
// 编辑付款单凭证 /payManage/uploadPaymentVoucher
export function uploadPaymentVoucher (params) {
  return request({
    url: '/back-manage-web/payManage/uploadPaymentVoucher',
    method: 'POST',
    data: params
  })
}
//  立即发送
export function paymentSerial (params) {
  const param = params.requestParameter
  return request({
    // url: `/ouser-web/mobileRegister/sendCaptchas/paymentSerial?allinpayId=${param.allinpayId}&&paymentSerial=${param.paymentSerial}`,
    url: `/ouser-web/paymentSms/sendPaymentSerial?allinpayId=${param.allinpayId}&&paymentSerial=${param.paymentSerial}`,
    method: 'POST',
    data: params
  })
}
//  下拉物流信息
export function merchantExpressConfig () {
  return request({
    url: `/oms-web/merchantExpressConfig/list`,
    method: 'get'
  })
}
//  物流公司
export function findInvoiceListExpress (params) {
  return request({
    url: `/back-manage-web/findInvoice/listExpress`,
    method: 'get',
    params
  })
}
