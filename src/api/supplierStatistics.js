import request from '@/utils/request'
// import mrequest from '@/utils/mrequest'

const userApi = {
  // back-manage-web/
  // listUrl: 'back_manage_web_war/admittanceAuditAction/supplierStatisticsReport',
  // exportUrl: 'back_manage_web_war/admittanceAuditAction/exportSupplierStatisticsReport',
  listUrl: '/back-manage-web/admittanceAuditAction/supplierStatisticsReport',
  exportUrl: '/back-manage-web/admittanceAuditAction/exportSupplierStatisticsReport'
}
// 查询列表
export function getPageStatistics(params) {
  return request({
    url: userApi.listUrl,
    method: 'post',
    data: params
  })
}

// 导出
export function exportStatistics(params) {
  return request({
    url: userApi.exportUrl,
    method: 'post',
    responseType: 'blob', // blob  arraybuffer
    data: params
  })
}
