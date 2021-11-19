/*
 * @Author: your name
 * @Date: 2021-07-20 23:54:55
 * @LastEditTime: 2021-08-07 14:41:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/orderCenter.js
 */
import request from '@/utils/request'
const api = {
  // 供应商订单列表页查询接口
  // listSoPage: '/oms-web/so/listSoPage',
  listSoPage: '/oms-web/so/quyerOrderListPage',
  // 供应商订单详情页接口
  getSoDetail: '/oms-web/so/getSoDetail',
  soAuditListPage: '/oms-web/soAudit/listPage',
  // 销售商家
  getUserMerchantInfo: '/oms-web/public/merchant/getUserMerchantInfo',
  // 自动接单配置
  rulecoding: '/oms-web/autoConfirmRule/listPage',
  // 审核接口
  reviewByOrderCodes: '/oms-web/soAudit/review',
  // 导出订单
  exportData: '/oms-web/so/export',
  // 导出订单行
  exportItemData: '/oms-web/so/exportLine',
  // 修改运费
  modifyFreightPrice: '/oms-web/so/modifyFreightPrice',
  // 待确认(供应商)确认接口
  updateStatus: '/oms-web/so/updateStatus',
  // 查看任务
  soExportTaskScheduleListPage: '/oms-web/soExportTaskSchedule/listPage',
  // 物流配送
  merchantExpressConfigListPage: '/oms-web/merchantExpressConfig/listPage',
  // 物流公司获取
  listByCategorys: '/oms-web/public/order/code/listByCategorys',
  // 添加物流
  merchantExpressConfigAdd: '/oms-web/merchantExpressConfig/add',
  // 删除物流信息
  merchantExpressConfigDelete: '/oms-web/merchantExpressConfig/delete',
  // 更新物流信息
  merchantExpressConfigUpdate: '/oms-web/merchantExpressConfig/update',
  // 订单付款方式列表接口
  merchantPaymentConfigListPage: '/back-manage-web/merchantPaymentConfig/merchantPaymentConfigListPage',
  // 订单付款方式删除
  deleteMerchantPaymentConfig: '/back-manage-web/merchantPaymentConfig/deleteMerchantPaymentConfig',
  // 订单付款方式修改状态
  merchantPaymentConfigUpdateStatus: '/back-manage-web/merchantPaymentConfig/updateStatus',
  // 订单付款方式新增
  addMerchantPaymentConfig: '/back-manage-web/merchantPaymentConfig/addMerchantPaymentConfig',
  // 订单付款方式更新
  updateMerchantPaymentConfig: '/back-manage-web/merchantPaymentConfig/updateMerchantPaymentConfig',
  // 查询付款方式
  findPaymentType: '/back-manage-web/merchantPaymentConfig/findPaymentType',
  // 删除
  autoConfirmRuleDelete: '/oms-web/autoConfirmRule/delete',
  // 批量停用
  batchDisable: '/oms-web/autoConfirmRule/batchDisable',
  // 接单配置详情
  autoConfirmRuleCreateCode: '/oms-web/autoConfirmRule/createCode',
  // 获取变量名
  listByRuleType: '/oms-web/ruleVariable/listByRuleType',
  // 获取条件值
  queryChannelMap: '/ouser-web/api/channel/queryChannelMap.do',
  // 更新配置
  autoConfirmRule: '/oms-web/autoConfirmRule/update',
  // 新增配置
  autoConfirmRuleAdd: '/oms-web/autoConfirmRule/add',
  // 获取配置信息
  autoConfirmRuleGet: '/oms-web/autoConfirmRule/get',
  // 获取订单审核配置列表
  soApproveRuleListPage: '/oms-web/soApproveRule/listPage',
  // 创建订单审核功能
  mappingWarehouseRuleCreateCode: '/oms-web/mappingWarehouseRule/createCode',
  // 添加订单审核功能
  soApproveRuleAdd: '/oms-web/soApproveRule/add',
  // 删除订单列表审核功能
  soApproveRuleDelete: '/oms-web/soApproveRule/delete',
  // 批量停用审核列表
  soApproveRuleBatchDisable: '/oms-web/soApproveRule/batchDisable',
  // 获取订单审核列表数据
  soApproveRuleGet: '/oms-web/soApproveRule/get',
  // 更新订单审核列表
  soApproveRuleUpdate: '/oms-web/soApproveRule/update',
  // 批量确认
  batchUpdateOrderStatus: '/oms-web/so/batchUpdateOrderStatus'
  // 获取变量名对应的接口
  // listByRuleType: '/oms-web/ruleVariable/listByRuleType'
}
// 供应商订单列表页查询接口
export function listSoPage(params) {
  return request({
    url: api.listSoPage,
    method: 'post',
    data: params
  })
}
// 供应商订单详情页查询接口
export function getSoDetail(params) {
  return request({
    url: api.getSoDetail,
    method: 'post',
    data: params
  })
}
// 供应商订单审核列表查询接口
export function soAuditListPage(params) {
  return request({
    url: api.soAuditListPage,
    method: 'post',
    data: params
  })
}
// 销售商家
export function getUserMerchantInfo() {
  return request({
    url: api.getUserMerchantInfo,
    method: 'get'
  })
}
/**
 * 获取发票收货地址
 */
export function getAddressList() {
  return request({
    url: '/back-manage-web/invoiceInfo/findInvoiceAddress',
    method: 'get'
  })
}
/**
 * 添加发票收货地址
 * @param {*} data 提交表单
 */
export function setAddAddress(data) {
  return request({
    url: '/back-manage-web/invoiceInfo/addInvoiceAddress',
    method: 'post',
    data: data
  })
}
/**
 * 编辑发票收货地址
 * @param {*} data 提交表单
 */
export function setEditAddress(data) {
  return request({
    url: '/back-manage-web/invoiceInfo/updateInvoiceAddress',
    method: 'post',
    data: data
  })
}
/**
 * 删除发票收货地址
 * @param {Number} id 地址ID
 */
export function setDelAddress(id) {
  return request({
    url: '/back-manage-web/invoiceInfo/deleteInvoiceAddress',
    method: 'post',
    data: {
      id: id
    }
  })
}
/**
 * 设置默认地址
 * @param {Number} id 地址ID
 */
export function setDefaultAddress(id) {
  return request({
    url: '/back-manage-web/invoiceInfo/defaultAddress',
    method: 'post',
    data: {
      id: id,
      defaultCode: 1
    }
  })
}
/**
 * 获取发票收货地址
 */
export function getIncoiceList() {
  return request({
    url: '/back-manage-web/invoiceInfo/findInvoiceInfo',
    method: 'get'
  })
}
/**
 * 添加/编辑发票信息
 * @param {*} data 提交表单
 */
export function setAddIncoice(data) {
  return request({
    url: '/back-manage-web/invoiceInfo/updateInvoiceInfo',
    method: 'post',
    data: data
  })
}
/**
 * 获取供应商列表
 * @param {String} enterpriseName 模糊搜索内容
 */
export function getComList(enterpriseName) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/selectStoreOrgInfoByEnterpriseName',
    method: 'post',
    data: {
      enterpriseName: enterpriseName
    }
  })
}
// 自动接单
export function rulecoding(data) {
  return request({
    url: api.rulecoding,
    method: 'post',
    data: data
  })
}
/**
 * 导入文件
 * @param {*} data {file:文件}
 */
export function importFile(data) {
  return request({ url: '/back-manage-web/buyer/plan/excel/importByOrder', method: 'post', data: data })
}
/**
 * 获取项目物料明细
 * @param {*} data 查询表单
 */
export function getProjectMaterial(data) {
  return request({ url: '/back-manage-web/merchantOrgInfo/selectProjectMaterial', method: 'post', data: data })
}
/**
 * 下单！！！
 * @param {*} data 提交表单
 */
export function setAddOrder(data) {
  return request({ url: '/oms-web/manualOrder/createBuyerOrder', method: 'post', data: data })
}
/**
 * 获取采购订单列表
 * @param {*} data 查询表单
 */
export function getBuyerOrderList(data) {
  return request({ url: '/oms-web/so/quyerOrderListPage', method: 'post', data: data })
}
/**
 * 获取采购订单状态数量
 * @param {*} data 查询表单
 */
export function getBuyerOrderStateCount(data) {
  return request({ url: '/oms-web/so/countByStatus', method: 'post', data: data })
}
/**
 * 更新采购订单状态
 * @param {*} data {"orderCode":11,"orderStatus":11}
 */
export function setSubmitBuyerOrder(data) {
  return request({ url: '/oms-web/so/updateStatus', method: 'post', data: data })
}
/**
 * 取消采购订单
 * @param {*} data 查询表单
 */
export function setCancelBuyerOrder(data) {
  return request({ url: '/oms-web/so/cancel', method: 'post', data: data })
}
/**
 * 获取订单详情
 * @param {String} orderCode 订单编码
 */
export function getOrderDetail(orderCode) {
  return request({ url: '/oms-web/so/getSoDetail', method: 'post', data: { orderCode: orderCode } })
}
/**
 * 查询订单物料明细
 * @param {Object} data 查询表单
 */
export function getOrderMaterialList(data) {
  return request({ url: '/oms-web/so/quyerOrderLineListPage', method: 'post', data: data })
}
/**
 * 编辑订单物料明细
 * @param {Object} data 提交表单
 */
export function setEditMaterial(data) {
  return request({ url: '/oms-web/soItem/updateOrderAndUpdateSum', method: 'post', data: data })
}
/**
 * 删除订单物料明细
 * @param {Number} id 物料明细ID
 */
export function setDelMaterial(id) {
  return request({ url: '/oms-web/soItem/delOrderAndUpdateSum', method: 'post', data: [id] })
}
/**
 * 编辑保存订单
 * @param {Object} data 提交表单
 */
export function setEditOrder(data) {
  return request({ url: '/oms-web/so/updateSoDetail', method: 'post', data: data })
}
// 审核接口
export function reviewByOrderCodes(data) {
  return request({
    url: api.reviewByOrderCodes,
    method: 'post',
    data
  })
}
// 导出订单
export function exportData(data) {
  return request({
    url: api.exportData,
    method: 'post',
    data
  })
}
// 导出订单行
export function exportItemData(data) {
  return request({
    url: api.exportItemData,
    method: 'post',
    data
  })
}
// 修改运费
export function modifyFreightPrice(data) {
  return request({
    url: api.modifyFreightPrice,
    method: 'post',
    data
  })
}
// 待确认(供应商)确认接口
export function updateStatus(data) {
  return request({
    url: api.updateStatus,
    method: 'post',
    data
  })
}
// 查看任务
export function soExportTaskScheduleListPage(data) {
  return request({
    url: api.soExportTaskScheduleListPage,
    method: 'post',
    data
  })
}
// 物流配送信息
export function merchantExpressConfigListPage(data) {
  return request({
    url: api.merchantExpressConfigListPage,
    method: 'post',
    data
  })
}
// 物流公司获取
export function listByCategorys(data) {
  return request({
    url: api.listByCategorys,
    method: 'post',
    data
  })
}
// 物流公司添加
export function merchantExpressConfigAdd(data) {
  return request({
    url: api.merchantExpressConfigAdd,
    method: 'post',
    data
  })
}
// 删除物流信息
export function merchantExpressConfigDelete(data) {
  return request({
    url: api.merchantExpressConfigDelete,
    method: 'post',
    data
  })
}
// 更新物流信息
export function merchantExpressConfigUpdate(data) {
  return request({
    url: api.merchantExpressConfigUpdate,
    method: 'post',
    data
  })
}
// 订单付款方式列表接口
export function merchantPaymentConfigListPage(data) {
  return request({
    url: api.merchantPaymentConfigListPage,
    method: 'post',
    data
  })
}
// 订单付款方式删除
export function deleteMerchantPaymentConfig(data) {
  return request({
    url: api.deleteMerchantPaymentConfig,
    method: 'post',
    data
  })
}
// 订单付款方式修改状态
export function merchantPaymentConfigUpdateStatus(data) {
  return request({
    url: api.merchantPaymentConfigUpdateStatus,
    method: 'post',
    data
  })
}
// 删除接单配置
export function autoConfirmRuleDelete(data) {
  return request({
    url: api.autoConfirmRuleDelete,
    method: 'post',
    data
  })
}
// 批量停用
export function batchDisable(data) {
  return request({
    url: api.batchDisable,
    method: 'post',
    data
  })
}
// 配置创建详情
export function autoConfirmRuleCreateCode() {
  return request({
    url: api.autoConfirmRuleCreateCode,
    method: 'get'
  })
}
// 获取变量名
export function listByRuleType(data) {
  return request({
    url: api.listByRuleType,
    method: 'post',
    data
  })
}
// 获取条件值
export function queryChannelMap(data) {
  return request({
    url: api.queryChannelMap,
    method: 'post',
    data
  })
}
// 更新配置
export function autoConfirmRule(data) {
  return request({
    url: api.autoConfirmRule,
    method: 'post',
    data
  })
}
// 查询付款方式
export function findPaymentType(data) {
  return request({
    url: api.findPaymentType,
    method: 'post',
    data
  })
}
// 订单付款方式新增
export function addMerchantPaymentConfig(data) {
  return request({
    url: api.addMerchantPaymentConfig,
    method: 'post',
    data
  })
}
// 订单付款方式更新
export function updateMerchantPaymentConfig(data) {
  return request({
    url: api.updateMerchantPaymentConfig,
    method: 'post',
    data
  })
}
// 新增配置
export function autoConfirmRuleAdd(data) {
  return request({
    url: api.autoConfirmRuleAdd,
    method: 'post',
    data
  })
}
// 获取配置信息
export function autoConfirmRuleGet(data) {
  return request({
    url: api.autoConfirmRuleGet,
    method: 'post',
    data
  })
}
// 获取订单审核配置列表
export function soApproveRuleListPage(data) {
  return request({
    url: api.soApproveRuleListPage,
    method: 'post',
    data
  })
}
// 创建订单审核功能
export function mappingWarehouseRuleCreateCode() {
  return request({
    url: api.mappingWarehouseRuleCreateCode,
    method: 'get'
  })
}
// 获取条件值
export function getVariableValue(url, data) {
  return request({
    url: url,
    method: 'post',
    data
  })
}
// 添加审核列表
export function soApproveRuleAdd(data) {
  return request({
    url: api.soApproveRuleAdd,
    method: 'post',
    data
  })
}
// 删除审核列表
export function soApproveRuleDelete(data) {
  return request({
    url: api.soApproveRuleDelete,
    method: 'post',
    data
  })
}
// 批量停用审核列表
export function soApproveRuleBatchDisable(data) {
  return request({
    url: api.soApproveRuleBatchDisable,
    method: 'post',
    data
  })
}
// 获取订单审核列表数据
export function soApproveRuleGet(data) {
  return request({
    url: api.soApproveRuleGet,
    method: 'post',
    data
  })
}
// 更新订单审核列表
export function soApproveRuleUpdate(data) {
  return request({
    url: api.soApproveRuleUpdate,
    method: 'post',
    data
  })
}
// 批量确认
export function batchUpdateOrderStatus(data) {
  return request({
    url: api.batchUpdateOrderStatus,
    method: 'post',
    data
  })
}
// platformId
export function searchCom(data) {
  return request({
    url: '/back-manage-web/myContract/getCompanyByCondition',
    method: 'post',
    data
  })
}
// 查询审批流是否开启
export function listModuleSwitcherByKey(params) {
  return request({
    url: '/ouser-web/admin/listModuleSwitcherByKey',
    method: 'get',
    params
  })
}

// // 获取变量名对应的接口
// export function listByRuleType(data) {
//   return request({
//     url: api.listByRuleType,
//     method: 'post',
//     data
//   })
// }
