import request from '@/utils/request'
export function getDistribution(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/queryBuyerPlanItemPage',
    method: 'post',
    data: params
  })
}
export function confirmAllocation(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/confirmAllocation',
    method: 'post',
    data: params
  })
}
export function distributionPlan(params) {
  return request({
    url: '/back-manage-web/buyerPlan/distributionPlan',
    method: 'post',
    data: params
  })
}
export function buyerChange(params) {
  return request({
    url: '/back-manage-web/buyer/change',
    method: 'post',
    data: params
  })
}
// 配置采购员
export function buyerInfo(params) {
  return request({
    url: '/back-manage-web/buyer/info',
    method: 'post',
    data: params
  })
}
export function closePlan(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/closePlan',
    method: 'post',
    data: params
  })
}
export function savePlanMatchingContract(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/savePlanMatchingContract',
    method: 'post',
    data: params
  })
}
// 计划待分配列表count数
export function getCountPendingDispatch(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/countPendingDispatch',
    method: 'get',
    params
  })
}
