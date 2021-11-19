import request from '@/utils/request'

const userApi = {
  // Query: '/back-manage-web/merchantOrgInfo/pageMerchantOrgInfo',
  Query: '/back-manage-web/merchantOrgInfo/sysPageMerchantOrgInfo',
  BusinessCategory: '/back-manage-web/category/queryMerchantCategory',
  QualificationCertificate: '/back-manage-web/qualification/selectPage',
  addQualifications: '/back-manage-web/qualification/add',
  deleteQualifications: '/back-manage-web/qualification/delete',
  updateQualifications: '/back-manage-web/qualification/update',
  designatedFactoryInspection: '/back-manage-web/merchantOrgInfo/examineUpdate',
  updateCategory: '/back-manage-web/qualification/update'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */

export function supplieAuthAdminQuyery(parameter) {
  return request({
    url: userApi.Query,
    method: 'post',
    data: parameter
  })
}

export function deleteQualifications(parameter) {
  return request({
    url: userApi.deleteQualifications,
    method: 'post',
    data: parameter
  })
}

export function updateQualifications(parameter) {
  return request({
    url: userApi.updateQualifications,
    method: 'post',
    data: parameter
  })
}

export function designatedFactoryInspection(parameter) {
  return request({
    url: userApi.designatedFactoryInspection,
    method: 'post',
    data: parameter
  })
}

export function businessCategory(parameter) {
  return request({
    url: userApi.BusinessCategory,
    method: 'post',
    data: parameter
  })
}
export function qualificationCertificate(parameter) {
  return request({
    url: userApi.QualificationCertificate,
    method: 'post',
    data: parameter
  })
}

// 添加资质
export function addQualifications(parameter) {
  return request({
    url: userApi.addQualifications,
    method: 'post',
    data: parameter
  })
}
export function qualificationList(params) {
  return request({
    url: '/back-manage-web/qualification/selectAll',
    method: 'get',
    params: params
  })
}
export function updateCategory(params) {
  return request({
    url: userApi.updateCategory,
    method: 'post',
    data: params
  })
}

// 保存/添加验厂信息
export function addMerchantOrgInfoExamine(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/examineAdd',
    method: 'post',
    data: params
  })
}

// 获取验厂信息
export function getMerchantOrgInfoDetail(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/examineDetail',
    method: 'get',
    params: params
  })
}

// 综合评审情况列表
export function getPageComprehensiveReview(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/pageComprehensiveReview',
    method: 'post',
    data: params
  })
}

// 关联企业列表
export function getPageAssociatedEnterprise(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/pageAssociatedEnterprise',
    method: 'post',
    data: params
  })
}

// 设备清单列表
export function getPageEquipmentInventoryCheckInfo(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/pageEquipmentInventoryCheckInfo',
    method: 'post',
    data: params
  })
}

// 生产能力列表
export function getPageProductCapacityCheckInfo(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/pageProductCapacityCheckInfo',
    method: 'post',
    data: params
  })
}

// 库存量列表
export function getPageInventoryCapacityInfoList(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/inventoryCapacityInfoList',
    method: 'post',
    data: params
  })
}
// 提交审核
export function handle(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/updateMerchantInfo',
    method: 'post',
    data: params
  })
}
// 认证审核管理
export function reviewList(params) {
  return request({
    url: '/back-manage-web/review/select/id',
    method: 'post',
    data: params
  })
}
// 认证审核
export function reviewListAll(params) {
  return request({
    url: '/back-manage-web/review/select/list',
    method: 'post',
    data: params
  })
}
// 认证审核供应商
export function reviewListGet() {
  return request({
    url: '/back-manage-web/review/select',
    method: 'get'
  })
}
// 保存认证审核
export function reviewListSave(params) {
  return request({
    url: '/back-manage-web/review/save',
    method: 'post',
    data: params
  })
}
