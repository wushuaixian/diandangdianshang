import request from '@/utils/request'
import store from '@/store'
export function getafProcessList(params) {
  return request({
    url: '/appdflow-web/afProcess/listPage',
    method: 'post',
    data: params
  })
}
export function countList(params) {
  return request({
    url: '/appdflow-web/afProcess/countList',
    method: 'post',
    data: params
  })
}
export function addAfProcess(params) {
  return request({
    url: '/appdflow-web/afProcess/add',
    method: 'post',
    data: params
  })
}
// 获取全部审批单据接口
export function getAfTypeConfigList() {
  return request({
    url: '/appdflow-web/afTypeConfig/list',
    method: 'post',
    data: {}
  })
}
// 获取全部适用模块接口
export function getAfTaskConfigList() {
  return request({
    url: '/appdflow-web/code/listMulti',
    method: 'post',
    data: { categories: ['APPDFLOW_MODEL_PLAT'] }
  })
}
export function existEnableProcess(data) {
  return request({
    url: '/appdflow-web/afProcess/existEnableProcess',
    method: 'post',
    data
  })
}
export function updateStatus(data) {
  return request({
    url: '/appdflow-web/afProcess/updateStatus',
    method: 'post',
    data
  })
}
export function getById(params) {
  return request({
    url: '/appdflow-web/afProcess/getById',
    method: 'get',
    params
  })
}
export function list(data) {
  return request({
    url: '/appdflow-web/afVariable/list',
    method: 'post',
    data
  })
}

export function saveNode(data) {
  return request({
    url: '/appdflow-web/afProcess/saveNode',
    method: 'post',
    data
  })
}

export function deleteAfProcess(data) {
  return request({
    url: '/appdflow-web/afProcess/delete',
    method: 'post',
    data
  })
}
export function getListMulti(data) {
  return request({
    url: '/appdflow-web/code/listMulti',
    method: 'post',
    data
  })
}
export function getCompanyInfos(platformId) {
  return request({
    url: '/back-manage-web/myContract/getCompanyInfos',
    method: 'post',
    data: { platformId: platformId || store.state.permission.isPlatform }
  })
}

export function getModelTypeList(data) {
  return request({
    url: '/appdflow-web/afProcess/getModelTypeList',
    method: 'post',
    data
  })
}
