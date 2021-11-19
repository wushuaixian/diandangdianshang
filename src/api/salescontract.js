import request from '@/utils/request'
import store from '@/store'

const userApi = {
  // supplier: '/ouser-web/merchantOrgInfo/pageMerchantOrgInfo'
  queryContractSupplierList: '/back-manage-web/myContract/queryContractSupplierList',
  getCompanyInfo: 'back-manage-web/myContract/getCompanyInfo',
  updateContracts: 'back-manage-web/myContract/updateContracts',
  queryContractPurchaseSign: '/back-manage-web/contractPurchase/queryContractPurchaseSign',
  querySearchStatus: '/back-manage-web/contractPurchase/querySearchStatus',
  queryContractPurchaseById: '/back-manage-web/contractPurchase/queryContractPurchaseById'
}
// 采购待签合同列表
export function queryContractPurchaseSign (params) {
  return request({
    url: userApi.queryContractPurchaseSign,
    method: 'POST',
    data: { ...params, platformId: store.state.permission.isPlatform }
  })
}
// 寻源项目编号
export function queryContractPurchaseById (params) {
  return request({
    url: userApi.queryContractPurchaseById,
    method: 'get',
    params
  })
}

// 寻源方式查询接口
export function querySearchStatus (params) {
  return request({
    url: userApi.querySearchStatus,
    method: 'POST',
    data: params
  })
}

// 确认合同
export function updateContracts (params) {
  return request({
    url: userApi.updateContracts,
    method: 'POST',
    data: params
  })
}

// 查询公司
export function getCompanyInfo (params) {
  return request({
    url: userApi.getCompanyInfo,
    method: 'get',
    params: { platformId: store.state.permission.isPlatform }
  })
}
// 查询合同待审批列表接口
export function queryContractSupplierList (params) {
  return request({
    url: userApi.queryContractSupplierList,
    method: 'POST',
    data: { ...params, platformId: store.state.permission.isPlatform }
  })
}
// 销售合同导出
export function exportAsyncEvent (params) {
  return request({
    url: '/back-manage-web/contract/mp/asyncTask/asyncEvent',
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
