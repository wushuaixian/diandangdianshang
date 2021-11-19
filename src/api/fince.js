import request from '@/utils/request'

// 供应商我的财务首页头部数据
export function suppliersHomeTitle (params) {
  return request({
    url: '/back-manage-web/account/balance',
    method: 'get',
    params: params
  })
}
// 供应商我的财务 收支明细
export function tiankun (params) {
  return request({
    url: '/back-manage-web/account/detail',
    method: 'post',
    data: params
  })
}

// 账户状态查询
export function accountStatus (params) {
  return request({
    url: '/back-manage-web/accountManage/checkWhetherBinding',
    method: 'post',
    data: params
  })
}
// 请求通联签约
export function signAContract (params) {
  return request({
    url: '/back-manage-web/accountManage/signContract',
    method: 'post',
    data: params
  })
}

// 获取通联验证码
export function getCode (params) {
  return request({
    // 先用自己的
    url: '/back-manage-web/accountManage/sendVerificationCode',
    method: 'post',
    data: params
  })
}
// 通联验证码校验
export function checkCaptchas (params) {
  return request({
    url: '/ouser-web/mobileRegister/checkCaptchas',
    method: 'post',
    data: params
  })
}
// 通联验证码校验
export function updatePassword (params) {
  return request({
    url: '/ouser-web/mobileRegister/updatePassword',
    method: 'post',
    data: params
  })
}
// 绑定手机号
export function bindingMobilePhone (params) {
  return request({
    url: '/back-manage-web/accountManage/bindPhone',
    method: 'post',
    data: params
  })
}
// 修改手机号
export function updateMobile (params) {
  return request({
    url: '/ouser-web/mobileRegister/updateMobile',
    method: 'post',
    data: params
  })
}
// 支付管理页面返回绑定状态
export function paymentManagementStatus (params) {
  return request({
    url: '/back-manage-web/accountManage/findType',
    method: 'get',
    params: params
  })
}

// 查询支付手机号
export function queryFincePhone (params) {
  return request({
    url: '/back-manage-web/accountManage/queryPhoneNo',
    method: 'get',
    params: params
  })
}

// 设置支付密码

export function setPaymentPassword (params) {
  return request({
    url: '/back-manage-web/accountManage/submit',
    method: 'post',
    data: params
  })
}
// 修改支付密码
// oldSecret原密码
// paysecret新密码
export function ChangePassword (params) {
  return request({
    url: '/back-manage-web/accountManage/changeSecret',
    method: 'post',
    data: params
  })
}
// 解绑手机
export function UnbindingMobilePhone (params) {
  return request({
    url: '/back-manage-web/accountManage/unbindPhone',
    method: 'post',
    data: params
  })
}
// 获取非通联验证码
export function getlocalCode (params) {
  return request({
    url: '/ouser-web/mobileRegister/sendCaptchas',
    method: 'post',
    data: params
  })
}
// 非通联验证码校验
export function localVerificationCode (params) {
  return request({
    url: '/ouser-web/mobileRegister/checkCaptchas',
    method: 'post',
    data: params
  })
}

// 申请充值金额
export function rechargeAmount (params) {
  return request({
    url: '/back-manage-web/recharge/rechargeAmount',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 重绑手机号申请 authorizationUrl changePhone
export function rebalancingApplication (params) {
  return request({
    url: '/back-manage-web/bindPhone/changeApply',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 授权审核列表
export function authorizationAuditList (params) {
  return request({
    url: '/back-manage-web/bindPhone/queryAndPage',
    method: 'post',
    data: params
  })
}
// 授权审核弹窗
export function authorizationAuditStatus (params) {
  return request({
    url: '/back-manage-web/bindPhone/audit',
    method: 'post',
    data: params
  })
}
// 重绑手机号
export function rebalancePhone (params) {
  return request({
    url: '/back-manage-web/accountManage/changePhone',
    method: 'post',
    data: params
  })
}

// 重绑手机号获取的手机号码
export function getrebalancePhone (params) {
  return request({
    url: '/back-manage-web/accountManage/findChangePhone',
    method: 'get',
    params: params
  })
}

// 授权管理状态数量
export function authorizationAuditStatusNum (params) {
  return request({
    url: '/back-manage-web/bindPhone/queryCount',
    method: 'get',
    params: params
  })
}

// 检测账号银行信息完善
export function checkFinanceInfo () {
  return request({
    url: '/back-manage-web/accountManage/checkFinanceInfo',
    method: 'post'
  })
}

// 收银台选择余额或组合支付时 支付密码校验
export function paymentPasswordVerification (params) {
  return request({
    url: '/back-manage-web/accountManage/verifyPassword',
    method: 'post',
    data: params
  })
}

// 余额支付时第一次获取验证码
export function balanceFirstGetVerificationCode (params) {
  return request({
    url: '/back-manage-web/payment/order/create',
    method: 'post',
    data: params
  })
}
// 余额支付时重新获取验证码
export function balanceAgainGetVerificationCode (params) {
  return request({
    url: '/back-manage-web/payment/order/resendPaySMS',
    method: 'post',
    data: params
  })
}
// 余额支付确定
export function balanceDetermination (params) {
  return request({
    url: '/back-manage-web/payment/order/balanceConfirm',
    method: 'post',
    data: params
  })
}
// 组合余额支付确定
export function combinationBalanceDetermination (params) {
  return request({
    url: '/back-manage-web/payment/order/groupConfirm',
    method: 'post',
    data: params
  })
}

// 发送 设置密码修改密码验证码
export function sendPaymentPwdCode (params) {
  return request({
    url: '/ouser-web/paymentSms/sendPaymentPwdCode',
    method: 'post',
    data: params
  })
}
// 发送 设置密码修改密码验证码校验
export function checkPaymentPwdCode (params) {
  return request({
    url: '/ouser-web/paymentSms/checkPaymentPwdCode',
    method: 'post',
    data: params
  })
}
// 商家余额管理页list查询
export function businessBalanceAdminList (params) {
  return request({
    url: '/back-manage-web/account/merchant',
    method: 'post',
    data: params
  })
}
// 罚款管理list
export function penaltyManagementList (params) {
  return request({
    url: '/back-manage-web/forfeit/example',
    method: 'post',
    data: params
  })
}
// 银行账户个数查询
export function queryBankNumber (params) {
  return request({
    url: '/back-manage-web/account/merchant/bank',
    method: 'get',
    params: params
  })
}
// 模糊查询公司名称
export function queryCompanyName (params) {
  return request({
    url: '/back-manage-web/forfeit/companyList',
    method: 'get',
    params: params
  })
}
// 创建罚款单
export function createForfeit (params) {
  return request({
    url: '/back-manage-web/forfeit/createForfeit',
    method: 'post',
    data: params
  })
}
// 重新创建罚款单
export function resetCreate (params) {
  return request({
    url: '/back-manage-web/forfeit/resetCreate',
    method: 'post',
    data: params
  })
}

// 商家余额导出
export function merchantBalanceExport (params) {
  return request({
    url: '/back-manage-web/account/merchant/export',
    method: 'post',
    responseType: 'blob',
    data: params
  })
}

// 更改银行账户
// /finance/info/change/bankcard/create
export function changeBank (params) {
  return request({
    url: '/back-manage-web/finance/info/change/bankcard/create',
    method: 'post',
    data: params
  })
}
// 罚款审核
export function fineExamine (params) {
  return request({
    url: '/back-manage-web/forfeit/auditForfeit',
    method: 'post',
    data: params
  })
}
// 换绑银行卡授权审核列表
export function changeBankExaminelist (params) {
  return request({
    url: '/back-manage-web/finance/info/change/bankcard/queryAndPage',
    method: 'post',
    data: params
  })
}
// 换绑银行卡审核
export function changeBankExamine (params) {
  return request({
    url: '/back-manage-web/finance/info/change/bankcard/update',
    method: 'post',
    data: params
  })
}
// 审核设置
export function setExamine (params) {
  return request({
    url: '/back-manage-web/scene/approval/config/createOrUpdate',
    method: 'post',
    data: params
  })
}
// 查询审核设置
export function querySetExamine (params) {
  return request({
    url: '/back-manage-web/scene/approval/config/query',
    method: 'get',
    params: params
  })
}
// 平台保证金划扣list
export function bondBuckleList (params) {
  return request({
    url: '/back-manage-web/deduct/example',
    method: 'post',
    data: params
  })
}

// 发票导出
export function exportInvoice (params) {
  return request({
    url: '/back-manage-web/back/mp/asyncTask/asyncEvent',
    method: 'post',
    data: params
  })
}
// 查询导出id
export function exportId (params) {
  return request({
    url: '/back-manage-web/forfeit/findExportTaskId',
    method: 'get',
    params: params
  })
}
// 查询发票导出list
export function queryExportList (params) {
  return request({
    url: '/back-manage-web/forfeit/findExportList',
    method: 'post',
    data: params
  })
}
// 平台保证金划扣执行划扣
export function executeDeduct (formData) {
  return request({
    url: '/back-manage-web/deduct/execute',
    method: 'post',
    processData: false,
    data: formData
  })
}
// 平台保证金退还list

export function queryMarginRefund (params) {
  return request({
    url: '/back-manage-web/margin/refund/queryMarginRefund',
    method: 'post',
    data: params
  })
}
// 财务首页保证金退还信息查询
export function queryBondReturn (params) {
  return request({
    url: '/back-manage-web/margin/refund/queryBalance',
    method: 'get',
    params: params
  })
}
// 财务首页保证金退还信息提交
export function addMarginRefund (params) {
  return request({
    url: '/back-manage-web/margin/refund/addMarginRefund',
    method: 'post',
    data: params
  })
}
// 平台保证金执行退还按钮
export function updateMarginRefund (params) {
  return request({
    url: '/back-manage-web/margin/refund/updateMarginRefund',
    method: 'post',
    data: params
  })
}
// 明细导出
export function detailedExport (params) {
  return request({
    url: '/back-manage-web/account/detail/excel/export',
    method: 'post',
    data: params
  })
}
// 查看支付后的返回结果
export function getResult (params) {
  return request({
    url: '/back-manage-web/payment/order/getResult',
    method: 'post',
    data: params
  })
}

// 合并付款列表页面
export function mergePaymentList (params) {
  return request({
    url: '/back-manage-web/payment/order/merge',
    method: 'post',
    data: params
  })
}
// 合并付款
export function mergePayment (params) {
  return request({
    url: '/back-manage-web/merge/payment/bill/create',
    method: 'post',
    data: params
  })
}

// 应付、付款导出
export function feeBillManageImplExport (params) {
  return request({
    url: '/back-manage-web/merchant/excel/export/asyncEvent',
    method: 'post',
    data: params
  })
}
// 采购财务首页校验是否提交换绑银行卡审核
export function validChangeBankCard (params) {
  return request({
    url: '/back-manage-web/finance/info/change/bankcard/validChangeBankCard'
  })
}
// 校验银行卡是否提交
export function validOrderCode (params) {
  return request({
    url: '/back-manage-web/payManage/validOrderCode',
    method: 'post',
    data: params
  })
}
// 应付管理重新提交
export function PayableRelaunch (params) {
  return request({
    url: '/back-manage-web/merchant/fee/resubmit',
    method: 'post',
    data: params
  })
}
/**
 * 订单导出
 * @param {Object} params 导出提交表单
 */
export function ExportOmsWeb (params) {
  return request({
    url: '/oms-web/back/mp/asyncTask/asyncEvent',
    method: 'post',
    data: params
  })
}
/**
 * 查询是否重复支付
 * @param {Object} params 收银台查看订单是否支付完成
 */
export function checkOrder (params) {
  return request({
    url: '/back-manage-web/payment/order/checkOrder',
    method: 'get',
    params
  })
}

// 财务审核按钮是否显示
export function isShowExamineBtn (params) {
  return request({
    url: '/appdflow-web/afProcess/getAppdflowConfig',
    method: 'post',
    data: params
  })
}

// 平台保证金明细导出
export function bondDetailExport (params) {
  return request({
    url: '/back-manage-web/account/detail/excel/export',
    method: 'post',
    data: params
  })
}
