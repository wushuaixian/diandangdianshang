import request from '@/utils/request'
/**
 * 获取联营模块列表
 */
export function getCategory() {
  return request({ url: '/ouser-web/admin/listCodeInfoPool', method: 'post' })
}
/**
 * 数字词典查询
 * @param {Object} data
 */
export function getCodePage (data) {
  return request({ url: '/ouser-web/admin/listCodeInfoPage', method: 'post', data: data })
}
/**
 * 新增数据字典信息
 * @param {Object} data { pool: 编码, category: 联营模块, name: 字典名称, code: 编码, language: 语言 }
 */
export function setAddCode (data) {
  return request({ url: '/ouser-web/admin/addOne', method: 'post', data: data })
}
/**
 * 查看数据字典详情
 * @param {String} pool 编码
 * @param {Number} category 联营模块
 */
export function getCode(pool, category) {
  return request({ url: '/ouser-web/admin/listCodeDetail', method: 'post', data: { pool: pool, category: category } })
}
/**
 * 编辑数据字典详情
 * @param {Number} id 字典主键
 * @param {String} name 字典名称
 */
export function setEditCode(id, name) {
  return request({ url: '/ouser-web/admin/updateCodeName', method: 'post', data: { id: id, name: name } })
}
/**
 * 删除数据字典详情
 * @param {Number} id 字典主键
 */
export function setDelCode(id) {
  return request({ url: '/ouser-web/admin/deleteCode', method: 'post', data: { id: id } })
}
