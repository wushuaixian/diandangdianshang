import request from '@/utils/request'

const userApi = {
  // 平台维度选择
  postSelect: '/back-manage-web/goodsAuditPlatform/select',
  // 平台维度保存
  postAdd: '/back-manage-web/goodsAuditPlatform/add',
  // 平台维度日志列表
  postQueryLogList: '/back-manage-web/goodsAuditPlatform/queryLog',
  // 查询类目维度列表
  postGoodsAuditCategoryQuery: 'back-manage-web/goodsAuditCategory/query',
  // 查询类目维度新增类目树待选列表
  getAllCategoryList: '/back-manage-web/goodsAuditCategory/selectCategory',
  // 添加类目保存 接口
  postGoodsAuditCategoryAdd: '/back-manage-web/goodsAuditCategory/add',
  // 查询类目维度新增类目树已选列表
  // getOwenerCategoryList: '/back-manage-web/goodsAuditCategory/selectCategory',
  // 类目维度-删除
  postGoodsAuditCategoryDelete: 'back-manage-web/goodsAuditCategory/delete',
  // 类目维度- 以选列表
  postGoodsAuditCategoryGetSelected: '/back-manage-web/goodsAuditCategory/getSelected',
  // 商品审核-已选列表
  getSelected: '/back-manage-web/goodsAuditCategory/getSelected',
  // 查询供应商列表
  postSupplierList: '/back-manage-web/goodsAuditSupplier/select',
  // 新增时查询供应商信息
  postQuerySupplier: '/back-manage-web/packageOrders/querySupplier',

  /*  商品审核-供应商维度 */
  // 添加设置
  postGoodsAuditSupplierAdd: '/back-manage-web/goodsAuditSupplier/add',
  // 查询已选类目列表
  postSelectedCategoryIds: '/back-manage-web/goodsAuditSupplier/selectedCategoryIds',
  // 删除接口
  postGoodsAuditSupplierDelete: '/back-manage-web/goodsAuditSupplier/delete'
}

export function postSelect(params) {
  return request({
    url: userApi.postSelect,
    method: 'POST',
    data: params
  })
}
export function postGoodsAuditSupplierDelete(params) {
  return request({
    url: userApi.postGoodsAuditSupplierDelete,
    method: 'POST',
    data: params
  })
}
export function postSelectedCategoryIds(params) {
  return request({
    url: userApi.postSelectedCategoryIds,
    method: 'POST',
    data: params
  })
}
export function postAdd(params) {
  return request({
    url: userApi.postAdd,
    method: 'POST',
    data: params
  })
}
export function postQueryLogList(params) {
  return request({
    url: userApi.postQueryLogList,
    method: 'POST',
    data: params
  })
}
export function postGoodsAuditCategoryGetSelected(params) {
  return request({
    url: userApi.postGoodsAuditCategoryGetSelected,
    method: 'get',
    data: params
  })
}
export function getAllCategoryList(params) {
  return request({
    url: userApi.getAllCategoryList,
    method: 'POST',
    data: params
  })
}
export function postGoodsAuditCategoryQuery(params) {
  return request({
    url: userApi.postGoodsAuditCategoryQuery,
    method: 'POST',
    data: params
  })
}
export function postGoodsAuditCategoryDelete(params) {
  return request({
    url: userApi.postGoodsAuditCategoryDelete,
    method: 'POST',
    data: params
  })
}
export function postGoodsAuditCategoryAdd(params) {
  return request({
    url: userApi.postGoodsAuditCategoryAdd,
    method: 'POST',
    data: params
  })
}
export function postSupplierList(params) {
  return request({
    url: userApi.postSupplierList,
    method: 'POST',
    data: params
  })
}
export function postQuerySupplier(params) {
  return request({
    url: userApi.postQuerySupplier,
    method: 'POST',
    data: params
  })
}
export function postGoodsAuditSupplierAdd(params) {
  return request({
    url: userApi.postGoodsAuditSupplierAdd,
    method: 'POST',
    data: params
  })
}
export function getSelected(params) {
  return request({
    url: userApi.getSelected,
    method: 'POST',
    data: params
  })
}
