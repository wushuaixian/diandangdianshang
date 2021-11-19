import request from '@/utils/request'

/* 供应商保证金-新增/编辑 */
export function postaddPurchaseStoreDeposit(params) {
  return request({
    url: '/back-manage-web/bondSet/addPurchaseStoreDeposit',
    method: 'post',
    data: params
  })
}
// 供应商保证金-查询
export function getDetailPurchaseStoreDeposit(params) {
  return request({
    url: '/back-manage-web/bondSet/detailPurchaseStoreDeposit',
    method: 'get',
    data: params
  })
}

/* 供应商保证金-日志查询 */
export function postpagePurchaseStoreDepositLog(params) {
  return request({
    url: '/back-manage-web/bondSet/pagePurchaseStoreDepositLog',
    method: 'post',
    data: params
  })
}

/* 供应商保证金-查询天数设置 */
export function postListDepositBackDay(params) {
  return request({
    url: '/back-manage-web/bondSet/listDepositBackDay',
    method: 'get',
    data: params
  })
}

/* 供应商保证金-修改天数设置 */
export function postUpdateDepositBackDay(params) {
  return request({
    url: '/back-manage-web/bondSet/updateDepositBackDay',
    method: 'post',
    data: params
  })
}

/* 供应商保证金-查看日志列表 */
export function postpageDepositBackDayLog(params) {
  return request({
    url: '/back-manage-web/bondSet/pageDepositBackDayLog',
    method: 'post',
    data: params
  })
}
/* 采购商免保证金-查询列表 */
export function postPagePurchaseFreeDeposit(params) {
  return request({
    url: '/back-manage-web/bondSet/pagePurchaseFreeDeposit',
    method: 'post',
    data: params
  })
}
/* 采购商免保证金-查询日志列表 */
export function postPagePurchaseFreeDepositLog(params) {
  return request({
    url: '/back-manage-web/bondSet/pagePurchaseFreeDepositLog',
    method: 'post',
    data: params
  })
}
/* 采购商免保证金-删除 */
export function postDeletePurchaseFreeDeposit(params) {
  return request({
    url: '/back-manage-web/bondSet/deletePurchaseFreeDeposit',
    method: 'get',
    params
  })
}
/* 采购商免保证金-批量添加查询列表 接口 */
export function postMerchantOrgInfoOrgPage(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/orgPage',
    method: 'post',
    data: params
  })
}
/* 采购商免保证金-新增 */
export function postAddPurchaseFreeDeposit(params) {
  return request({
    url: '/back-manage-web/bondSet/addPurchaseFreeDeposit',
    method: 'post',
    data: params
  })
}
