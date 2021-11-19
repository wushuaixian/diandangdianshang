import request from '@/utils/request'

// import store from '@/store'

const userApi = {
  // 套餐权益类型
  postListMulti: '/back-manage-web/code/listMulti',
  // 权益列表清单
  postQueryList: '/back-manage-web/equity/query',
  // 更改权益清单状态
  postUpdateStatus: '/back-manage-web/equity/updateStatus',
  // 权益清单添加
  postEquityAdd: '/back-manage-web/equity/add',
  // 权益清单删除
  postEquityDelete: '/back-manage-web/equity/delete',
  // 权益清单编辑
  postupdateId: '/back-manage-web/equity/queryById',
  // 权益清单-调序
  postAdjustSequence: '/back-manage-web/equity/adjustSequence',
  // 会员套餐列表
  postPackInfos: '/back-manage-web/packInfos/query',
  // 新增会员套擦管理信息
  postpackInfosAdd: '/back-manage-web/packInfos/add',
  // 更改会员套餐状态
  postPackInfosUpdateStatus: '/back-manage-web/packInfos/updateStatus',
  // 删除会员套餐数据
  postPackInfosDelete: '/back-manage-web/packInfos/delete',
  // 查询会员套餐明细
  postPackageOrdersList: '/back-manage-web/packageOrders/query',
  // 修改会员套餐管理列表数据
  postPackInfosQueryAll: '/back-manage-web/packInfos/queryAll',
  // 查询会员会员套餐关联明细列表
  postQueryAll: '/back-manage-web/packageOrders/queryAll',
  // 查询会员套餐管理选择关联权益列表
  postselectRelatedInterests: '/back-manage-web/packInfos/selectRelatedInterests',
  // 会员套餐管理-调序
  postPackInfosAdjustSequence: '/back-manage-web/packInfos/adjustSequence',

  // 关联权益供应商列表
  postQuerySupplier: '/back-manage-web/packageOrders/querySupplier',
  // 关联权益列表
  postPackageOrdersAdd: '/back-manage-web/packageOrders/add',
  // 关联权益列表调级
  postPackageOrdersUpdate: '/back-manage-web/packageOrders/update',
  // 关联权益添加 下拉框查询
  postQueryAllPackages: '/back-manage-web/packageOrders/queryAllPackages'
}

export function postPackageOrdersList(params) {
  return request({
    url: userApi.postPackageOrdersList,
    method: 'POST',
    data: params
  })
}
export function postAdjustSequence(params) {
  return request({
    url: userApi.postAdjustSequence,
    method: 'POST',
    data: params
  })
}
export function postPackageOrdersUpdate(params) {
  return request({
    url: userApi.postPackageOrdersUpdate,
    method: 'POST',
    data: params
  })
}
export function postPackInfosAdjustSequence(params) {
  return request({
    url: userApi.postPackInfosAdjustSequence,
    method: 'POST',
    data: params
  })
}
export function postListMulti(params) {
  return request({
    url: userApi.postListMulti,
    method: 'POST',
    data: params
  })
}
export function postQueryAll(params) {
  return request({
    url: userApi.postQueryAll,
    method: 'POST',
    data: params
  })
}
export function postpackInfosAdd(params) {
  return request({
    url: userApi.postpackInfosAdd,
    method: 'POST',
    data: params
  })
}
export function postPackInfosQueryAll(params) {
  return request({
    url: userApi.postPackInfosQueryAll,
    method: 'POST',
    data: params
  })
}
export function postQueryList(params) {
  return request({
    url: userApi.postQueryList,
    method: 'POST',
    data: params
  })
}
export function postEquityAdd(params) {
  return request({
    url: userApi.postEquityAdd,
    method: 'POST',
    data: params
  })
}
export function postupdateId(params) {
  return request({
    url: userApi.postupdateId,
    method: 'POST',
    data: params
  })
}
export function postUpdateStatus(params) {
  return request({
    url: userApi.postUpdateStatus,
    method: 'POST',
    data: params
  })
}
export function postPackInfos(params) {
  return request({
    url: userApi.postPackInfos,
    method: 'POST',
    data: params
  })
}

export function postPackInfosUpdateStatus(params) {
  return request({
    url: userApi.postPackInfosUpdateStatus,
    method: 'POST',
    data: params
  })
}
export function postEquityDelete(params) {
  return request({
    url: userApi.postEquityDelete,
    method: 'POST',
    data: params
  })
}
export function postPackInfosDelete(params) {
  return request({
    url: userApi.postPackInfosDelete,
    method: 'POST',
    data: params
  })
}

export function postselectRelatedInterests(params) {
  return request({
    url: userApi.postselectRelatedInterests,
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
export function postPackageOrdersAdd(params) {
  return request({
    url: userApi.postPackageOrdersAdd,
    method: 'POST',
    data: params
  })
}
export function postQueryAllPackages(params) {
  return request({
    url: userApi.postQueryAllPackages,
    method: 'POST',
    data: params
  })
}
