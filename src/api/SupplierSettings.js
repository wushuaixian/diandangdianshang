import request from '@/utils/request'

export function getQueryPurchaseGrade(params) {
  return request({
    // url: '/back-manage-web/appealAction/page',
    url: '/back-manage-web/purchaseGrade/queryPurchaseGrade',
    method: 'get',
    data: params
  })
}

export function postEditGrade(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/editGrade',
    method: 'post',
    data: params
  })
}

export function postQueryGradeProportionPlanPage(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/queryGradeProportionPlanPage',
    method: 'post',
    data: params
  })
}

export function postAddOrUpdateGradeProportionPlan(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/addOrUpdateGradeProportionPlan',
    method: 'post',
    data: params
  })
}

export function postScorePlanDetail(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/getGradeDetail',
    method: 'post',
    data: params
  })
}

export function postCopy(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/copy',
    method: 'post',
    data: params
  })
}
// 等级占比

// export function postGradeDetail(params) {
//   return request({
//     url: '/back-manage-web/purchaseGrade/getGradeDetail',
//     method: 'post',
//     data: params
//   })
// }
// 供应商等级设置新增接口

export function getConfigDetail(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/getConfigDetail',
    method: 'get',
    data: params
  })
}

// 供应商等级占比方案信息删除接口(郑兴祥)
export function postDeleteById(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/deleteById',
    method: 'post',
    data: params
  })
}
// 供应商等级占比方案启用、停用接口(郑兴祥)

export function postUpdateStatus(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/updateStatus',
    method: 'post',
    data: params
  })
}

// 自动获取编码接口
export function postContractCode(params) {
  return request({
    url: '/back-manage-web/contractTemplate/getContractCode',
    method: 'post',
    data: params
  })
}

// 类目分值比例信息查询接口

export function getCategoryList(params) {
  return request({
    url: '/back-manage-web/category/getCategoryList',
    method: 'post',
    data: params
  })
}

// 供应商评分方案查询接口
// /back-manage-web/purchaseScore/queryPlanInfoPage

export function queryPlanInfoPage(params) {
  return request({
    url: '/back-manage-web/purchaseScore/queryPlanInfoPage',
    method: 'post',
    data: params
  })
}

// 供应商评分查询

export function getSupplierScorePage(params) {
  return request({
    url: '/back-manage-web/audit/getSupplierScorePage',
    method: 'post',
    data: params
  })
}

// 供应商评分方案启用、停用接口

export function updateStatus(params) {
  return request({
    url: '/back-manage-web/purchaseScore/updateStatus',
    method: 'post',
    data: params
  })
}

// 供应商评分方案信息删除接口

export function deleteById(params) {
  return request({
    url: '/back-manage-web/purchaseScore/deleteById',
    method: 'post',
    data: params
  })
}

// 供应商评分方案信息保存
export function addOrUpdatePlanInfo(params) {
  return request({
    url: '/back-manage-web/purchaseScore/addOrUpdatePlanInfo',
    method: 'post',
    data: params
  })
}

// 供应商评分方案信息编辑接口

export function getScorePlanDetail(params) {
  return request({
    url: '/back-manage-web/purchaseScore/getScorePlanDetail',
    method: 'post',
    data: params
  })
}

// 类目分值树

export function getCategory(params) {
  return request({
    url: '/back-manage-web/category/getCategory',
    method: 'post',
    data: params
  })
}

// 类目分值比例信息新增

export function addOrUpdateCategoryScoreProportion(params) {
  return request({
    url: '/back-manage-web/category/addOrUpdateCategoryScoreProportion',
    method: 'post',
    data: params
  })
}

// 供应商评分汇总查询接口

export function getScoreDetail(params) {
  return request({
    url: '/back-manage-web/audit/getScoreDetail',
    method: 'post',
    data: params
  })
}

// 供应商评分查询等级下拉列表

export function queryPurchaseGrade(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/queryPurchaseGrade',
    method: 'get',
    data: params
  })
}

// 查询主营类目下拉列表的接口下拉列表

export function queryOneToThree(params) {
  return request({
    url: '/back-manage-web/category/queryOneToThree',
    method: 'get',
    data: params
  })
}

// 查询供应商的接口下拉列表
export function getPlatCompanyInfo(params) {
  return request({
    url: '/back-manage-web/myContract/getPlatCompanyInfo',
    method: 'post',
    data: params
  })
}

// 查询供应商的接口下拉列表
export function getCategoryDetail(params) {
  return request({
    url: '/back-manage-web/category/getCategoryDetail',
    method: 'post',
    data: params
  })
}

// 查询供应商的接口下拉列表
export function getScorePlan(params) {
  return request({
    url: '/back-manage-web/category/getScorePlan',
    method: 'post',
    data: params
  })
}

// 类目分值比例信息新增或编辑接口
export function getGradePlan(params) {
  return request({
    url: '/back-manage-web/category/getGradePlan',
    method: 'get',
    data: params
  })
}

// 类目分值比例信息新增或编辑接口
export function postMonthScoreDetai(params) {
  return request({
    url: '/back-manage-web/audit/postMonthScoreDetail',
    method: 'post',
    data: params
  })
}

// 类目分值比例信息新增或编辑接口
export function getSupplierAuditPage(params) {
  return request({
    url: '/back-manage-web/audit/getSupplierAuditPage',
    method: 'post',
    data: params
  })
}

// 类目分值比例信息新增或编辑接口
export function adjustLevel(params) {
  return request({
    url: '/back-manage-web/audit/adjustLevel',
    method: 'post',
    data: params
  })
}

// 导出请求
export function exportScoreItem(params) {
  return request({
    url: '/back-manage-web/audit/exportScoreItem',
    method: 'get',
    data: params
  })
}

// 占比方案复制保存接口
export function copy(params) {
  return request({
    url: '/back-manage-web/purchaseGrade/copy',
    method: 'post',
    data: params
  })
}
// 供应商评分方案复制保存接口
export function purchaseScoreCopy(params) {
  return request({
    url: '/back-manage-web/purchaseScore/copy',
    method: 'post',
    data: params
  })
}

export function getScoreAuditDetail(params) {
  return request({
    url: '/back-manage-web/audit/getScoreAuditDetail',
    method: 'post',
    data: params
  })
}

// 供应商调级审核列表 切换全部调用数量 单独接口
export function getStatusNumber(params) {
  return request({
    url: '/back-manage-web/audit/getStatusNumber ',
    method: 'post',
    data: params
  })
}

// 审核接口
export function submitAudio(params) {
  return request({
    url: '/back-manage-web/audit/updateAuditStatus',
    method: 'post',
    data: params
  })
}
