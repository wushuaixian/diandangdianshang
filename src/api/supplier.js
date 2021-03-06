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
// ????????????????????????????????????
export function savePlanMatchingContract(params) {
  return request({
    url: userApi.savePlanMatchingContract,
    method: 'post',
    data: params
  })
}
// ????????????????????????
export function savePlanMatchingContractNew(data) {
  return request({
    url: '/back-manage-web/planMatchingInterimAction/savePlanMatchingContract',
    method: 'post',
    data
  })
}
// ????????????????????????
export function modifyPurchaseExecution(data) {
  return request({
    url: '/back-manage-web/planMatchingInterimAction/modifyPurchaseExecution',
    method: 'post',
    data
  })
}

// ????????????????????????
export function update(params) {
  return request({
    url: userApi.update,
    method: 'post',
    data: params
  })
}
// ??????????????????/material/update
export function all(params) {
  return request({
    url: userApi.all,
    method: 'get',
    params
  })
}
// ????????????????????????
export function addMateria(params) {
  return request({
    url: userApi.addMateria,
    method: 'POST',
    data: params
  })
}
// ????????????
export function deleteFile(params) {
  return request({
    url: userApi.deleteFile,
    method: 'POST',
    params
  })
}
// ????????????-??????
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
// ??????????????????
export function getMaterialByUser(params) {
  return request({
    url: userApi.getMaterialByUser,
    method: 'POST',
    params
  })
}
// ?????????????????????
export function getSupplierMerchant(params) {
  return request({
    url: userApi.getSupplierMerchant,
    method: 'POST',
    data: params
  })
}
// ?????????????????????????????????
export function getMerchantConfigMaterial(params) {
  return request({
    url: userApi.getMerchantConfigMaterial,
    method: 'POST',
    data: params
  })
}
// ????????????excel??????
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
// ?????????????????????
export function selectlist(params) {
  return request({
    url: userApi.selectlist,
    method: 'POST',
    data: params
  })
}
// ??????????????????
export function createBuyerPlanPO(params) {
  return request({
    url: userApi.createBuyerPlanPO,
    method: 'POST',
    data: params
  })
}
// ??????????????????
export function submitReview(params) {
  return request({
    url: userApi.submitReview,
    method: 'POST',
    data: params
  })
}
// ??????????????????
export function buyerPlanUpdate(params) {
  return request({
    url: userApi.buyerPlanUpdate,
    method: 'POST',
    data: params
  })
}
// ?????????????????????????????????
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
// ????????????
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

// ????????????
export function supplierEquipment(params) {
  return request({
    url: userApi.supplierEquipment,
    method: 'POST',
    data: params
  })
}
// ????????????
export function supplierpage(params) {
  return request({
    url: userApi.supplierpage,
    method: 'POST',
    data: params
  })
}
// ???????????????????????????????????????
export function equipmentInventoryPage(params) {
  return request({
    url: '/back-manage-web/equipmentInventoryInfo/page',
    method: 'post',
    data: params
  })
}
// ???????????????????????????????????????
export function productCapacityPage(params) {
  return request({
    url: '/back-manage-web/productCapacityInfo/page',
    method: 'post',
    data: params
  })
}

// ?????????????????????????????????
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
// ??????????????????
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

// ????????????????????????
export function getApplyList() {
  return request({
    url: '/back-manage-web/package/info/query/equity/list',
    method: 'GET'
  })
}

// ????????????????????????
export function addPackageOrder(params) {
  return request({
    url: '/back-manage-web/package/order/add',
    method: 'post',
    data: params
  })
}

// ????????????????????????
export function getPackageOrderList(params) {
  return request({
    url: '/back-manage-web/package/order/query/list',
    method: 'get',
    params
  })
}
// ????????????????????????
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
// ??????????????????
export function getPackageIsNo() {
  return request({
    url: '/back-manage-web/package/info/packageList',
    method: 'get'
  })
}
// ??????????????????????????????
export function personalEnterprisePayment(orderNo) {
  return request({
    url: '/back-manage-web/package/order/add',
    method: 'post',
    data: orderNo
  })
}
// ??????
export function updatePlanItem(params) {
  return request({
    url: '/back-manage-web/buyerPlanItem/updatePlanItem',
    method: 'post',
    data: params
  })
}
// ??????????????????
export function ViewAuditOpinion(params) {
  return request({
    url: '/back-manage-web/operateRecord/info',
    method: 'post',
    data: params
  })
}

// ???????????????
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
