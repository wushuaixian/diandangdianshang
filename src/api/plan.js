import request from '@/utils/request'
// 获取物料明细接口
export function getMaterialList(data) {
  return request({
    url: '/back-manage-web/material/page',
    method: 'post',
    data
  })
}

// 物料类目接口
export function getCategoryAll(params) {
  return request({
    url: '/back-manage-web/materialcategory/all',
    method: 'get',
    params
  })
}
// 添加物料
export function addPlanItemByMaterial(data) {
  return request({
    url: '/back-manage-web/buyerPlanItem/addPlanItemByMaterial',
    method: 'post',
    data
  })
}
