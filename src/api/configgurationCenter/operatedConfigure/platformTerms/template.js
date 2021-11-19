import request from '@/utils/request'
/**
 * 新增模版
 * @param {*} data { "type": 模板类型, "title": "模板标题", "code": "模板编码", "url": "上传模板URL" }
 */
export function addTemplate(data) {
  return request({ url: '/back-manage-web/moduleConfig/addModuleConfig', method: 'post', data: data })
}
/**
 * 新增模版
 * @param {*} data { "id": 主键, "type": 模板类型, "title": "模板标题", "code": "模板编码", "url": "上传模板URL" }
 */
export function editTemplate(data) {
  return request({ url: '/back-manage-web/moduleConfig/addModuleConfig', method: 'post', data: data })
}
/**
 * 删除模板
 * @param {Number} id 要删除的主键
 */
export function delTemplate(id) {
  return request({ url: '/back-manage-web/moduleConfig/deleteModuleConfig', method: 'get', params: { id: id } })
}
/**
 * 模板详情
 * @param {Number} id 模板主键
 */
export function getTemplateDetail(id) {
  return request({ url: '/back-manage-web/moduleConfig/detailModuleConfig', method: 'get', params: { id: id } })
}
/**
 * 根据类型查询模版详情
 * @param {String} type 模板类型
 */
export function getTemplateDetailWithType(type) {
  return request({ url: '/back-manage-web/moduleConfig/detailType', method: 'get', params: { type: type } })
}
/**
 * 设置模板状态
 * @param {*} isAvailable 启用状态
 * @param {*} id 模版id
 * @param {*} type 模板类型
 */
export function setTemplateState(isAvailable, id, type) {
  return request({ url: '/back-manage-web/moduleConfig/updateModuleConfigState', method: 'post', data: { isAvailable: isAvailable, id: id, type: type } })
}
/**
 * 获取模板列表
 * @param {*} data { "currentPage": 分页, "itemsPerPage": 分页, "isAvailable": 启用状态, "type": 模板类型 }
 */
export function getTemplatePage(data) {
  return request({ url: '/back-manage-web/moduleConfig/pageModuleConfig', method: 'post', data: data })
}
