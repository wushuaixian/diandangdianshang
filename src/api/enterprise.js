import request from '@/utils/request'

const etnerpriseApi = {
  listMulti: '/back-manage-web/code/listMulti',
  queryBankaps: '/back-manage-web/aliyun/bankInfo/queryBankaps',
  ocrIdFace: '/back-manage-web/aliyun/ocr/ocrIdFace', // 身份证正面
  ocrIdBack: '/back-manage-web/aliyun/ocr/ocrIdBack', // 身份证反面
  businessDetailApi: '/back-manage-web/merchantOrgInfo/merchantOrgInfoPending', // 获取工商信息详情
  appealActionApi: '/back-manage-web/appealAction/add', // 立即申诉
  merchantOrgInfoApi: '/back-manage-web/merchantOrgInfo/recommitAudit', // 提交审核
  uploadFileApi: '/back-manage-web/media/uploadFile',
  queryFInanceInfoByMerchantId: '/back-manage-web/financeInfo/queryFinanceInfoByMerchantId', // 企业银行查询
  submitFinanceInfo: '/back-manage-web/financeInfo/submitFinanceInfo', // 企业信息注册
  checkFinanceInfo: '/back-manage-web/financeInfo/checkFinanceInfo', // 企业信息注册
  linkmanInfoApi: '/back-manage-web/contact/selectAll', // 联系人信息
  linkmanInfoAddApi: '/back-manage-web/contact/add', // 联系人信息添加
  linkmanInfoUpdateApi: '/back-manage-web/contact/update', // 联系人信息编辑
  linkmanInfoDeleteApi: '/back-manage-web/contact/delete', // 联系人信息删除
  queryMerchantCategory: 'back-manage-web/category/queryMerchantCategory'
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

// 账户银行信息获取上传
export function queryFInanceInfoByMerchantId(data) {
  let params = ''
  if (data && data.merchantId) {
    params = '?merchantId=' + data.merchantId
  }
  return request({
    url: etnerpriseApi.queryFInanceInfoByMerchantId + params,
    method: 'get'
  })
}
// 企业信息验证
export function checkFinanceInfo(parameter) {
  return request({
    url: etnerpriseApi.checkFinanceInfo,
    method: 'post',
    data: parameter
  })
}
// 企业信息注册
export function submitFinanceInfo(parameter) {
  return request({
    url: etnerpriseApi.submitFinanceInfo,
    method: 'post',
    data: parameter
  })
}
// 图片上传
export function uploadFile(parameter) {
  return request({
    url: etnerpriseApi.uploadFileApi,
    method: 'post',
    data: parameter
  })
}
// 银行信息
export function listmulti(parameter) {
  return request({
    url: etnerpriseApi.listMulti,
    method: 'post',
    data: parameter
  })
}
// 获取工商信息详情
export function getBusinessDetail(data) {
  let params = ''
  if (data && data.merchantId) {
    params = '?merchantId=' + data.merchantId
  }
  return request({
    url: etnerpriseApi.businessDetailApi + params,
    method: 'get'
  })
}
// 联行号查询
export function queryBankaps(params) {
  return request({
    url: etnerpriseApi.queryBankaps,
    method: 'get',
    params: params
  })
}
// 身份证正面
export function ocrIdFace(params) {
  return request({
    url: etnerpriseApi.ocrIdFace,
    method: 'get',
    params: params
  })
}
// 身份证反面
export function ocrIdBack(params) {
  return request({
    url: etnerpriseApi.ocrIdBack,
    method: 'get',
    params: params
  })
}
// 立即申诉
export function appealAction(params) {
  return request({
    url: etnerpriseApi.appealActionApi,
    method: 'post',
    data: params
  })
}
// 提交审核
export function merchantOrgInfo(params) {
  return request({
    url: etnerpriseApi.merchantOrgInfoApi,
    method: 'post',
    data: params
  })
}
// 联系人信息
export function getLinkmanInfo(data) {
  let params = ''
  if (data && data.merchantId) {
    params = '?merchantId=' + data.merchantId
  }
  return request({
    url: etnerpriseApi.linkmanInfoApi + params,
    method: 'get'
  })
}
// 联系人信息添加
export function addLinkmanInfo(params) {
  return request({
    url: etnerpriseApi.linkmanInfoAddApi,
    method: 'post',
    data: params
  })
}
// 联系人信息编辑
export function linkmanInfoUpdateApi(params) {
  return request({
    url: etnerpriseApi.linkmanInfoUpdateApi,
    method: 'post',
    data: params
  })
}
// 联系人信息删除
export function linkmanInfoDeleteApi(params) {
  return request({
    url: etnerpriseApi.linkmanInfoDeleteApi,
    method: 'post',
    data: params
  })
}

// 资质类目
export function queryMerchantCategory(params) {
  return request({
    url: etnerpriseApi.queryMerchantCategory,
    method: 'post',
    data: params
  })
}

// 查询类目树
export function getAllCategoryList(params) {
  return request({
    url: '/back-manage-web/category/queryMerAllCategory',
    method: 'post',
    data: params
  })
}

// 查询已选类目树
export function getOwenerCategoryList(params) {
  return request({
    url: '/back-manage-web/category/queryOwenerCategory',
    method: 'post',
    data: params
  })
}

export function addCategory(params) {
  return request({
    url: '/back-manage-web/category/addCategory',
    method: 'post',
    data: params
  })
}

// 设备清单列表
export function equipmentInventoryPage(params) {
  return request({
    url: '/back-manage-web/equipmentInventoryInfo/page',
    method: 'post',
    data: params
  })
}

// 生产产能列表
export function productCapacityPage(params) {
  return request({
    url: '/back-manage-web/productCapacityInfo/page',
    method: 'post',
    data: params
  })
}

export function deleteCategory(params) {
  return request({
    url: '/back-manage-web/category/detele',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function addOrUpdateInvoice(params) {
  return request({
    url: '/back-manage-web/invoice/addOrUpdate',
    method: 'post',
    data: params
  })
}
export function getInvoiceDetail(params) {
  return request({
    url: '/back-manage-web/invoice/detail',
    method: 'get',
    params
  })
}
