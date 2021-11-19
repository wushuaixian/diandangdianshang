import request from '@/utils/request'
/**
 * 新增条款
 * @param {*} data { "entryType": "条款类型", "title": "条款标题", "entryCode": "条款编码", "content": "条款内容" }
 */
export function addAgreement(data) {
  return request({ url: '/ouser-web/entryTerms/add', method: 'post', data: data })
}
/**
 * 删除条款
 * @param {Array} ids ID数组
 */
export function delAgreement(id) {
  return request({ url: '/ouser-web/entryTerms/delete', method: 'get', params: { id: id } })
}
/**
 * 修改条款
 * @param {*} data { "id": 1, "entryType": "条款类型", "title": "条款标题", "entryCode": "条款编码", "content": "条款内容" }
 */
export function editAgreement(data) {
  return request({ url: '/ouser-web/entryTerms/update', method: 'post', data: data })
}
/**
 * 设置模板状态
 * @param {*} isAvailable 启用状态
 * @param {*} id 模版id
 * @param {*} type 模板类型
 */
export function setAgreementState(isAvailable, id, entryType) {
  return request({ url: '/ouser-web/entryTerms/updateState', method: 'post', data: { isAvailable: isAvailable, id: id, entryType: entryType } })
}
/**
 * 获取条款详情
 * @param {*} id 条款ID
 */
export function getAgreementDetail(id) {
  return request({ url: '/ouser-web/entryTerms/get', method: 'get', params: { id: id } })
}
/**
 * 获取条款详情
 * @param {String} entryType 条款类型
 */
export function getAgreementDetailWithType(entryType) {
  return request({ url: '/ouser-web/entryTerms/getType', method: 'get', params: { entryType: entryType } })
}
/**
 * 条款分页列表
 * @param {*} data `{ "currentPage": 1, "itemsPerPage": 3, "isAvailable": 是否可用:0否 1是, "entryType": 条款类型 }`
 */
export function getAgreement(data) {
  return request({ url: '/ouser-web/entryTerms/listPage', method: 'post', data: data })
}
