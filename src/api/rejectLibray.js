import request from '@/utils/request'

// 消息事件获取列表
export function rejectLibrayList(params) {
  return request({
    url: '/back-manage-web/refutationLibraryType/selectRefutationLibraryTypeVOByQuery',
    method: 'post',
    data: params
  })
}
// 分页查询驳回话术列表接口
export function getLibrayList(params) {
  return request({
    url: '/back-manage-web/refutationLibrary/selectRefutationLibraryByQuery',
    method: 'post',
    data: params
  })
}
// 添加驳回话术分类接口
export function addLibray(params) {
  return request({
    url: '/back-manage-web/refutationLibraryType/createRefutationLibraryTypePO',
    method: 'post',
    data: params
  })
}
// 编辑驳回话术分类接口
export function editLibray(params) {
  return request({
    url: '/back-manage-web/refutationLibraryType/updataRefutationLibraryTypePO',
    method: 'post',
    data: params
  })
}
// 删除驳回话术分类接口
export function deleteLibray(params) {
  return request({
    url: '/back-manage-web/refutationLibraryType/deleteRefutationLibraryTypePO',
    method: 'post',
    data: params
  })
}
// 创建驳回话术接口
export function addLibrayList(params) {
  return request({
    url: '/back-manage-web/refutationLibrary/createRefutationLibraryPO',
    method: 'post',
    data: params
  })
}
// 更新驳回话术列表
export function updateLibrayList(params) {
  return request({
    url: '/back-manage-web/refutationLibrary/updataRefutationLibraryPO',
    method: 'post',
    data: params
  })
}
// 删除驳回话术列表
export function deleteLibrayList(params) {
  return request({
    url: '/back-manage-web/refutationLibrary/deleteRefutationLibraryPO',
    method: 'post',
    data: params
  })
}
