// 供应商应付审核
import request from '@/utils/request'
export function getAuditstate(id) {
  return request({
    url: `/back-manage-web/merchant/fee/querydetailpagebyfeefillcode?id=${id}`,
    method: 'get'
  })
}
