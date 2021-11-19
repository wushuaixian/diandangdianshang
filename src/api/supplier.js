import request from '@/utils/request'

const userApi = {
  // supplier: '/ouser-web/merchantOrgInfo/pageMerchantOrgInfo'
  supplier: 'back-manage-web/merchantOrgInfo/pageExamine',
  // supplier: 'back-manage-web/merchantOrgInfo/sysPageMerchantOrgInfo',
  reviewofenterprises: 'back-manage-web/merchantOrgInfo/pageComprehensiveReview',
  supplieraffiliatedenterprises: 'back-manage-web/merchantOrgInfo/pageAssociatedEnterprise',
  supplierEquipment: 'back-manage-web/merchantOrgInfo/pageEquipmentInventoryCheckInfo',
  supplierpage: 'back-manage-web/merchantOrgInfo/pageProductCapacityCheckInfo',
  supplierDetailo: 'back-manage-web/merchantOrgInfo/examineDetail',
  supplieraudits: 'back-manage-web/admittanceAuditAction/batchSubmit',
  supplierbusiness: 'back-manage-web/merchantOrgInfo/detailMerchantOrgOcrInfo',
  supplierbusinessNew: 'back-manage-web/merchantOrgInfo/detailMerchantOrgInfo',
  excelload: 'back-manage-web/buyer/plan/excel/load',
  selectlist: 'back-manage-web/buyer/project/select/list',
  submitReview: 'back-manage-web/buyerPlan/submitReview',
  buyerPlanUpdate: 'back-manage-web/buyerPlan/update',
  createBuyerPlanPO: 'back-manage-web/buyerPlan/createBuyerPlanPO',
  getMerchantConfigMaterial: 'back-manage-web/material/getMerchantConfigMaterial',
  getSupplierMerchant: 'back-manage-web/merchant/getSupplierMerchant',
  getMaterialByUser: 'back-manage-web/material/getMaterialByUser',
  info: 'back-manage-web/buyer/info',
  findBuyerPlanVOById: 'back-manage-web/buyerPlan/findBuyerPlanVOById',
  transferMaterial: 'back-manage-web/material/transferMaterial',
  deleteBuyerPlanItem: 'back-manage-web/buyerPlanItem/deleteBuyerPlanItem',
  deleteFile: 'back-manage-web/buyerPlanItem/deleteFile',
  addMateria: 'back-manage-web/material/addMaterial',
  all: 'back-manage-web/materialcategory/all',
  update: '/back-manage-web/material/updateMaterial',
  savePlanMatchingContract: '/back-manage-web/buyerPlanItem/savePlanMatchingContract',
  moveToPending: '/back-manage-web/buyerPlanItem/moveToPending',
  getPageInfoByKey: '/back-manage-web/code/getPageInfoByKey',
  queryPackageList: '/back-manage-web/package/info/queryPackageList'
  // downloadImportMpTemplate: '/back-manage-web/buyer/plan/excel/downloadImportMpTemplate'
}
//
export function getPageInfoByKey(params) {
  return request({
    url: userApi.getPageInfoByKey,
    method: 'post',
    data: params
  })
}
//
export function moveToPending(params) {
  return request({
    url: userApi.moveToPending,
    method: 'post',
    data: params
  })
}
// 保存采购计划合同结果接口
export function savePlanMatchingContract(params) {
  return request({
    url: userApi.savePlanMatchingContract,
    method: 'post',
    data: params
  })
}
// 新版保存长些接口
export function savePlanMatchingContractNew(data) {
  return request({
    url: '/back-manage-web/planMatchingInterimAction/savePlanMatchingContract',
    method: 'post',
    data
  })
}
// 修改长协数量接口
export function modifyPurchaseExecution(data) {
  return request({
    url: '/back-manage-web/planMatchingInterimAction/modifyPurchaseExecution',
    method: 'post',
    data
  })
}

// 物料类目编辑接口
export function update(params) {
  return request({
    url: userApi.update,
    method: 'post',
    data: params
  })
}
// 物料类目二级/material/update
export function all(params) {
  return request({
    url: userApi.all,
    method: 'get',
    params
  })
}
// 物料明细添加接口
export function addMateria(params) {
  return request({
    url: userApi.addMateria,
    method: 'POST',
    data: params
  })
}
// 删除附件
export function deleteFile(params) {
  return request({
    url: userApi.deleteFile,
    method: 'POST',
    params
  })
}
// 采购计划-删除
export function deleteBuyerPlanItem(params) {
  return request({
    url: userApi.deleteBuyerPlanItem,
    method: 'POST',
    params
  })
}

export function transferMaterial(params) {
  return request({
    url: userApi.transferMaterial,
    method: 'POST',
    data: params
  })
}

export function findBuyerPlanVOById(params) {
  return request({
    url: userApi.findBuyerPlanVOById,
    method: 'POST',
    data: params
  })
}

export function info(params) {
  return request({
    url: userApi.info,
    method: 'POST',
    data: params
  })
}
// 物料转移列表
export function getMaterialByUser(params) {
  return request({
    url: userApi.getMaterialByUser,
    method: 'POST',
    params
  })
}
// 获取采购商接口
export function getSupplierMerchant(params) {
  return request({
    url: userApi.getSupplierMerchant,
    method: 'POST',
    data: params
  })
}
// 采购员配置结果查询列表
export function getMerchantConfigMaterial(params) {
  return request({
    url: userApi.getMerchantConfigMaterial,
    method: 'POST',
    data: params
  })
}
// 新增计划excel导入
export function excelload(params) {
  return request({
    url: userApi.excelload,
    method: 'POST',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
// 新增计划物料表
export function selectlist(params) {
  return request({
    url: userApi.selectlist,
    method: 'POST',
    data: params
  })
}
// 新增计划创建
export function createBuyerPlanPO(params) {
  return request({
    url: userApi.createBuyerPlanPO,
    method: 'POST',
    data: params
  })
}
// 新增计划提交
export function submitReview(params) {
  return request({
    url: userApi.submitReview,
    method: 'POST',
    data: params
  })
}
// 修改计划提交
export function buyerPlanUpdate(params) {
  return request({
    url: userApi.buyerPlanUpdate,
    method: 'POST',
    data: params
  })
}
// 供应商审核认证列表接口
export function supplierAuditList(params) {
  return request({
    url: userApi.supplier,
    method: 'POST',
    data: params
  })
}

export function supplierAuditListterprises(params) {
  return request({
    url: userApi.reviewofenterprises,
    method: 'POST',
    data: params
  })
}

export function supplieraffiliatedenterprise(params) {
  return request({
    url: userApi.supplieraffiliatedenterprises,
    method: 'POST',
    data: params
  })
}
// 企业概况
export function enterpriseBasicDetail(data) {
  let params = ''
  if (data && data.merchantId) {
    params = '?merchantId=' + data.merchantId
  }
  return request({
    url: '/back-manage-web/enterpriseBasic/detail' + params,
    method: 'get'
  })
}

// 设备清单
export function supplierEquipment(params) {
  return request({
    url: userApi.supplierEquipment,
    method: 'POST',
    data: params
  })
}
// 生产产能
export function supplierpage(params) {
  return request({
    url: userApi.supplierpage,
    method: 'POST',
    data: params
  })
}
// 设备清单列表（企业概况内）
export function equipmentInventoryPage(params) {
  return request({
    url: '/back-manage-web/equipmentInventoryInfo/page',
    method: 'post',
    data: params
  })
}
// 生产产能列表（企业概况内）
export function productCapacityPage(params) {
  return request({
    url: '/back-manage-web/productCapacityInfo/page',
    method: 'post',
    data: params
  })
}

// 库存能力（企业概况内）
export function inventoryCapacityInfoPage(params) {
  return request({
    url: '/back-manage-web/inventoryCapacityInfo/page',
    method: 'post',
    data: params
  })
}

export function setAddenterpriseBasic(params) {
  return request({
    url: '/back-manage-web/enterpriseBasic/addOrUpdate',
    method: 'post',
    data: params
  })
}
// 详情列表信息
export function supplierDetailo(params) {
  return request({
    url: userApi.supplierDetailo,
    method: 'GET',
    params: params
  })
}

export function supplieraudits(params) {
  return request({
    url: userApi.supplieraudits,
    method: 'POST',
    data: params
  })
}

export function supplierbusiness(params) {
  return request({
    url: userApi.supplierbusiness,
    method: 'GET',
    params: params
  })
}
export function supplierbusinessNew(params) {
  return request({
    url: userApi.supplierbusinessNew,
    method: 'GET',
    params: params
  })
}

export function getMerchatInfo(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/detailMerchantOrg',
    method: 'GET',
    params: params
  })
}

// 获取套餐权益列表
export function getApplyList() {
  return request({
    url: '/back-manage-web/package/info/query/equity/list',
    method: 'GET'
  })
}

// 提交认证申请订单
export function addPackageOrder(params) {
  return request({
    url: '/back-manage-web/package/order/add',
    method: 'post',
    data: params
  })
}

// 获取套餐购买记录
export function getPackageOrderList(params) {
  return request({
    url: '/back-manage-web/package/order/query/list',
    method: 'get',
    params
  })
}
// 获取单条购买记录
export function queryPackageOrdeitem(data) {
  return request({
    url: '/back-manage-web//package/order/query/packageOrdeitem',
    method: 'post',
    data
  })
}

export function getPackageOrderDetail(orderNo) {
  return request({
    url: '/back-manage-web/package/order/query/packageOrdeitem',
    method: 'post',
    data: {
      orderNo: orderNo
    }
  })
}
// 套餐是否购买
export function getPackageIsNo() {
  return request({
    url: '/back-manage-web/package/info/packageList',
    method: 'get'
  })
}
// 套餐点击个人企业支付
export function personalEnterprisePayment(orderNo) {
  return request({
    url: '/back-manage-web/package/order/add',
    method: 'post',
    data: orderNo
  })
}
// 保存
export function updatePlanItem(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/updatePlanItem',
    method: 'post',
    data: params
  })
}
// 查看审核意见
export function ViewAuditOpinion(params) {
  return request({
    url: '/back-manage-web/operateRecord/info',
    method: 'post',
    data: params
  })
}

// 查看寻套餐
export function queryPackageList() {
  return request({
    url: userApi.queryPackageList,
    method: 'get'
  })
}
export function queryAllPackInfoEquity(data) {
  return request({
    url: '/back-manage-web/packInfos/queryAllPackInfoEquity',
    method: 'post',
    data
  })
}
export function queryPackInfoEquity(data) {
  return request({
    url: '/back-manage-web/packInfos/queryPackInfoEquity',
    method: 'post',
    data
  })
}
export function getBuyerPlanInfoById(params) {
  return request({
    url: '/back-manage-web/buyerPlan/getBuyerPlanInfoById',
    method: 'get',
    params
  })
}
export function deleteById({ id }) {
  return request({
    url: '/back-manage-web/buyerPlan/deleteById?id=' + id,
    method: 'post'
  })
}
