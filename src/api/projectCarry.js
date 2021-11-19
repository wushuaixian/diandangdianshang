// import request from '@/utils/request'
// // 长协代下单planMatchingContract/queryplanMatchingContractPage
// const userApi = {
//     planMatchingContract: '/back-manage-web/planMatchingContract/queryplanMatchingContractPage',
//     mappingLongTermContract: '/back-manage-web/buyerPlanItem/mappingLongTermContract'
// }
// export function planMatchingContractList (params) {
//     return request({
//         url: userApi.planMatchingContract,
//         method: 'post',
//         data: params
//     })
// }
// export function mappingLongTermContract (params) {
//     return request({
//         url: userApi.mappingLongTermContract,
//         method: 'post',
//         data: params
//     })
// }
import request from '@/utils/request'
// 计划待执行页面接口
export function queryplanMatchingContractPage(params) {
  return request({
    url: '/back-manage-web/planMatchingContract/queryplanMatchingContractPage',
    method: 'post',
    data: params
  })
}
// 计划待执行页面接口
export function queryBuyerPlanProcessPage(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/queryBuyerPlanProcessPage',
    method: 'post',
    data: params
  })
}
export function mappingLongTermContract(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/mappingLongTermContract',
    method: 'post',
    data: params
  })
}
export function ProcurementplanTobeimplemented(params) {
  return request({
    url: '/back-manage-web/planMatchingInterimAction/ProcurementplanTobeimplemented',
    method: 'post',
    data: params
  })
}

export function moveToPending(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/moveToPending',
    method: 'post',
    data: params
  })
}
export function buyerChange(data) {
  return request({
    url: '/back-manage-web/buyer/change',
    method: 'post',
    data
  })
}
export function transferToOthers(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/transferToOthers',
    method: 'post',
    data: params
  })
}
export function savePlanMatchingContract(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/savePlanMatchingContract',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 获取采购商接口
export function getSupplierMerchant() {
  return request({
    url: '/back-manage-web/merchant/getSupplierMerchant',
    method: 'post'
  })
}
// 获取供应商接口
export function getProviderMerchant() {
  return request({
    url: '/back-manage-web/merchant/getProviderMerchant',
    method: 'post'
  })
}

// 关闭采购计划接口
export function closePlan(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/closePlan',
    method: 'post',
    data: params
  })
}
// 合同列表查询接口
export function myContract(params) {
  return request({
    url: '/back-manage-web/myContract/all',
    method: 'post',
    data: params
  })
}
// 合同明细查询接口
export function contractItem(params) {
  return request({
    url: '/back-manage-web/contractItem/all',
    method: 'post',
    data: params
  })
}
// 获取登录用户信息
export function getLoginUserInfo() {
  return request({
    url: '/back-manage-web/user/loginUserInfo',
    method: 'get'
  })
}
// 查询字典表
export function getMultiList(params) {
  return request({
    url: '/back-manage-web/code/listMulti',
    method: 'post',
    data: params
  })
}

// 查询寻源列表

export function getSourceList(params) {
  return request({
    url: '/back-manage-web/buyer/project/select/list',
    method: 'post',
    data: params
  })
}
// 查询已下单列表
export function planExecuteListPage(data) {
  return request({
    url: '/back-manage-web/buyerPlan/planExecuteListPage',
    method: 'post',
    data
  })
}

// 获取当前登录人主商家id接口
export function puchaserEntityId() {
  return request({
    url: '/back-manage-web/buyerPlanItem/puchaserEntityId',
    method: 'get'
  })
}
// 计划待执行页各页签显示数量接口
export function countPendingExecute() {
  return request({
    url: '/back-manage-web/buyerPlanItem/countPendingExecute',
    method: 'get'
  })
}
// 采购寻源项目保存
export function projectSave(data) {
  return request({
    url: '/back-manage-web/buyer/project/save',
    method: 'post',
    data
  })
}

export function getItemByIds(data) {
  return request({
    url: '/back-manage-web/buyerPlanItem/getItemByIds',
    method: 'post',
    data
  })
}

// 下单
export function createOrder(data) {
  return request({
    url: '/back-manage-web/buyerPlanItem/createOrderByPlan',
    method: 'post',
    data
  })
}
// 根据供应商名称获取商家店铺信息
export function selectStoreOrgInfoByEnterpriseName(data) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/selectStoreOrgInfoByEnterpriseName',
    method: 'post',
    data
  })
}

// 手匹合同下单
export function createOrderPlanToBeExecuted(data) {
  return request({
    url: '/back-manage-web/buyerPlanItem/createOrderPlanToBeExecuted',
    method: 'post',
    data
  })
}

// 长协、零采下单
export function pendingOrder(data) {
  return request({
    url: '/back-manage-web/buyerPlanItem/pendingOrder',
    method: 'post',
    data
  })
}
