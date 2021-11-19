import request from '@/utils/request'
import store from '@/store'

// 合同审批列表
export function queryContractSupplierList (params) {
  return request({
    url: '/back-manage-web/myContract/queryContractSupplierList',
    method: 'post',
    data: { ...params, platformId: store.state.permission.isPlatform }
  })
}
// 合同审批
export function contractUpdateStatus (params) {
  return request({
    url: '/back-manage-web/myContract/updateStatus',
    method: 'post',
    data: params
  })
}

// 查询审批数量
export function contractUpdateStatusNumber (params) {
  return request({
    url: '/back-manage-web/myContract/count',
    method: 'post',
    data: { ...params, platformId: store.state.permission.isPlatform }
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
// 销售合同导出
export function exportAsyncEvent (params) {
  return request({
    url: '/back-manage-web/contract/mp/asyncTask/asyncEvent',
    method: 'post',
    data: params
  })
}
