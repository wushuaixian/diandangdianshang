import request from '@/utils/request'
import store from '@/store'

const userApi = {
  // 采购合同列表接口
  postContractList: '/back-manage-web/myContract/queryList',
  // 转供应商接口
  postSkipSupplier: '/back-manage-web/myContract/skipSupplier',
  // 撤回供应商接口
  postRecalSupplier: '/back-manage-web/myContract/rollBackStatus',
  // 删除合同接口
  postdeleteContractById: '/back-manage-web/myContract/deleteById',
  // 合同作废
  postCancelInvalid: '/back-manage-web/myContract/updateInvalid',
  // 提交审批
  postUpdateStatus: '/back-manage-web/myContract/updateStatus',
  // 合同终止
  postTerminateContract: '/back-manage-web/myContract/terminateContract',
  // 列表状态数量
  postStatusNumber: '/back-manage-web/myContract/getContractStatusNumber',
  // 合同变更
  postUpdateContract: '/back-manage-web/myContract/copyContract',
  // 上传双章合同
  uploadContract: '/back-manage-web/myContract/uploadContractStamp'
}

export function postContractList(params) {
  return request({
    url: userApi.postContractList,
    method: 'POST',
    data: { ...params, platformId: store.state.permission.isPlatform }
  })
}
export function postSkipSupplier(params) {
  return request({
    url: userApi.postSkipSupplier,
    method: 'POST',
    data: params
  })
}
export function postRecalSupplier(params) {
  return request({
    url: userApi.postRecalSupplier,
    method: 'POST',
    params
  })
}
export function postdeleteContractById(params) {
  return request({
    url: userApi.postdeleteContractById,
    method: 'POST',
    params
  })
}
export function postCancelInvalid(params) {
  return request({
    url: userApi.postCancelInvalid,
    method: 'POST',
    data: params
  })
}
export function postUpdateStatus(params) {
  return request({
    url: userApi.postUpdateStatus,
    method: 'POST',
    data: params
  })
}
export function postTerminateContract(params) {
  return request({
    url: userApi.postTerminateContract,
    method: 'POST',
    data: params
  })
}
export function postStatusNumber(params) {
  return request({
    url: userApi.postStatusNumber,
    method: 'POST',
    data: { ...params, platformId: store.state.permission.isPlatform }
  })
}
export function postUpdateContract(params) {
  return request({
    url: userApi.postUpdateContract,
    method: 'POST',
    data: params
  })
}
export function uploadContract(params) {
  return request({
    url: userApi.uploadContract,
    method: 'POST',
    data: params
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

/**
 * 创建订单
 * @param {Array} contractIds 合同ID数组
 */
export function creatOrder(contractIds) {
  return request({ url: '/back-manage-web/myContract/createOrderByContract', method: 'post', data: { contractIds: contractIds } })
}
