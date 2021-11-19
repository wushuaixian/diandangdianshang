import request from '@/utils/request'
import store from '@/store'
/**
 * 获取变量列表
 * @param {Number} templateSource 模板来源 1运营 2供应商 3采购商
 * @returns
 */
export function getFuncList(templateSource) {
  return request({
    url: '/back-manage-web/myContract/getContractVariable.do',
    method: 'get',
    params: { platformId: store.state.permission.isPlatform, templateSource: templateSource }
  })
}
/**
 * 获取变量列表
 * @param {Number} templateSource 模板来源 1运营 2供应商 3采购商
 * @returns
 */
export function getPlatContractVariable(templateSource) {
  return request({
    url: '/back-manage-web/myContract/getPlatContractVariable',
    method: 'post',
    data: { platformId: store.state.permission.isPlatform, templateSource: templateSource }
  })
}
/**
 * 获取公司列表
 */
export function getComList(platformId) {
  return request({
    url: '/back-manage-web/myContract/getCompanyInfo',
    method: 'get',
    params: { platformId: platformId || store.state.permission.isPlatform }
  })
}
/**
 * 获取公司列表(模糊搜索)
 * @param {Number} platformId 身份 1运营 6供应商 7采购商
 * @param {Number} templateSource 模板来源 1运营 2供应商 3采购商
 * @param {Number} message 搜索名称
 */
export function getPlatComList(platformId, templateSource, message) {
  return request({
    url: '/back-manage-web/myContract/getPlatCompanyInfo',
    method: 'post',
    data: { platformId: platformId, templateSource: templateSource, message: message }
  })
}
/**
 * 添加合同模板
 * @param {object} data
 * @returns
 */
export function setAddTemplate(data) {
  return request({ url: '/back-manage-web/contractTemplate/addContractTemplate', method: 'post', data: { ...data } })
}
/**
 * 获取合同模板列表
 * @param {object} data {
   "currentPage":1,
   "itemsPerPage":2,
   "merchantName":"公司名称",
   "code":"模板编码",
   "templateType": 模板类型,
   "createUsername": "创建人",
   "name": "模板名称"
}
 * @returns
 */
export function getTemplateList(data) {
  return request({
    url: '/back-manage-web/contractTemplate/queryContractTemplatePage',
    method: 'post',
    data: { ...data }
  })
}
/**
 * 查询总数
 * @param {*} data {
   "merchantIds":"企业ID列表",
   "code":"模板编码",
   "templateType":"模板类型",
   "name": "模板名称",
   "status":"模板状态",
}
 * @returns
 */
export function getStatusCount(data) {
  return request({ url: '/back-manage-web/contractTemplate/getCount.do', method: 'post', data: { ...data } })
}
/**
 * 合同模板更新状态
 * @param {string} id 模板主键
 * @param {stirng} status 状态（1.启用，2.停用）
 * @returns
 */
export function setUpdateTemplateStatus(id, status) {
  return request({
    url: '/back-manage-web/contractTemplate/updateStatus',
    method: 'post',
    data: { id: id, status: status }
  })
}
/**
 * 删除合同模板
 * @param {string} id 模板主键
 * @returns
 */
export function setDeleteTemplate(id) {
  return request({ url: '/back-manage-web/contractTemplate/deleteById', method: 'post', data: { id: id } })
}
/**
 * 获取模板详情
 * @param {string} id 模板主键
 * @returns
 */
export function getTemplateDetail(id) {
  return request({ url: '/back-manage-web/contractTemplate/getDetail', method: 'get', params: { id: id } })
}
/**
 * 编辑合同模板
 * @param {object} data
 * @returns
 */
export function setEditTemplate(data) {
  return request({ url: '/back-manage-web/contractTemplate/updateContractTemplate', method: 'post', data: data })
}
/**
 * 导入文件
 * @param {*} data {file:文件,number:模板类型 1.非物料导入 0.物料导入}
 * @returns
 */
export function importFile(data) {
  return request({ url: '/back-manage-web/myContract/importData.do', method: 'post', data: data })
}
/**
 * 获取合同模板列表
 * @returns
 */
export function getTemplateListNoPage(merchantId, platformId) {
  return request({
    url: '/back-manage-web/contractTemplate/selectContractTemplate',
    method: 'post',
    data: { merchantId: merchantId, platformId: platformId || store.state.permission.isPlatform }
  })
}
/**
 * 添加合同
 * @param {object} data
 * @returns
 */
export function addContract(data) {
  return request({ url: '/back-manage-web/myContract/addContractAndContractItem', method: 'post', data: data })
}
/**
 * 编辑合同
 * @param {object} data
 * @returns
 */
export function editContract(data) {
  return request({ url: '/back-manage-web/myContract/updateContract', method: 'post', data: data })
}
/**
 * 获取合同详情
 * @param {number} id 合同主键
 * @returns
 */
export function getContractDetail(id) {
  return request({ url: '/back-manage-web/myContract/selectContract', method: 'post', params: { id: id } })
}

/**
 * 计划中的物料列表
 * @param {number} id 合同主键
 * @returns
 */
export function getMaterialListWithPlan(ids) {
  return request({ url: '/back-manage-web/buyerPlan/getBuyerPlanByIds', method: 'post', data: { ids: ids } })
}
/**
 * 代签合同中的物料列表
 * @param {number} id 合同主键
 * @returns
 */
export function getMaterialListWithSign(ids) {
  return request({ url: '/back-manage-web/contractPurchase/getSignItems', method: 'post', data: { ids: ids } })
}
/**
 * 获取合同模板编码
 * @param {Number} templateSource 模板来源 1运营 2供应商 3采购商
 * @returns
 */
export function getTemplateCode(templateSource) {
  return request({
    url: '/back-manage-web/contractTemplate/getContractCode',
    method: 'post',
    data: { templateSource: templateSource }
  })
}
/**
 * 变更合同
 * @param {object} data
 * @returns
 */
export function setCopyContract(data) {
  return request({ url: '/back-manage-web/myContract/copyContract', method: 'post', data: data })
}
/**
 * 获取企业详细信息
 * @param {Number} buyerMerchantId 采购商ID
 * @param {Number} providerMerchantId 供应商ID
 * @returns
 */
export function getComDetail(buyerMerchantId, providerMerchantId) {
  return request({
    url: '/back-manage-web/myContract/queryTemplateInfoByCondition',
    method: 'post',
    data: { providerMerchantId: providerMerchantId, buyerMerchantId: buyerMerchantId }
  })
}
/**
 * 复制合同模板
 * @param {object} data
 * @returns
 */
export function setCopyTemplate(data) {
  return request({ url: '/back-manage-web/contractTemplate/copyContractTemplate', method: 'post', data: { ...data } })
}
/**
 * 从待签合同添加合同
 * @param {object} data
 * @returns
 */
export function addContractWithSign(data) {
  return request({ url: '/back-manage-web/myContract/createContract', method: 'post', data: data })
}
/**
 * 合同编码查重
 * @param {*} buyerMerchantId 采购商ID
 * @param {*} contractId 合同ID
 * @param {*} code 合同编码
 * @returns
 */
export function checkContractCode(buyerMerchantId, contractId, code) {
  return request({
    url: '/back-manage-web/myContract/checkContractCode',
    method: 'post',
    data: { buyerMerchantId: buyerMerchantId, contractId: contractId, code: code }
  })
}
/**
 * 查询供应商
 * @param {String} message 查询名称
 * @returns
 */
export function searchCom(message) {
  return request({
    url: '/back-manage-web/myContract/getCompanyByCondition',
    method: 'post',
    data: { platformId: store.state.permission.isPlatform, message: message }
  })
}
