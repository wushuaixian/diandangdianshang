/*
 * @Author: your name
 * @Date: 2021-07-21 16:55:05
 * @LastEditTime: 2021-07-22 14:36:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/basicService.js
 */
import request from '@/utils/request'
const api = {
  // 供应商订单列表页查询接口
  queryList: '/back-manage-web/purchaseDeploy/queryList',
  // 供应商订单详情页接口
  getSoDetail: '/oms-web/so/getSoDetail',
  purchaseDeploySave: '/back-manage-web/purchaseDeploy/save',
  purchaseDeployUpdate: '/back-manage-web/purchaseDeploy/update',
  queryUserList: '/back-manage-web/purchaseDeploy/queryUserList',
  updateUser: '/back-manage-web/purchaseDeploy/updateUser',
  purchaseDeployDelete: '/back-manage-web/purchaseDeploy/delete',
  queryDetail: '/back-manage-web/purchaseDeploy/queryDetail',
  merchantOrgInfoOrgPage: '/back-manage-web/merchantOrgInfo/orgPage'
}
// 查询采购商基础配置列表
export function queryList(data) {
  return request({
    url: api.queryList,
    method: 'post',
    data
  })
}
// 新增服务器地址
export function purchaseDeploySave(data) {
  return request({
    url: api.purchaseDeploySave,
    method: 'post',
    data
  })
}
// 更新服务器地址
export function purchaseDeployUpdate(data) {
  return request({
    url: api.purchaseDeployUpdate,
    method: 'post',
    data
  })
}
// 查询用户信息
export function queryUserList(data) {
  return request({
    url: api.queryUserList,
    method: 'post',
    data
  })
}
// 修改用户oa erp信息
export function updateUser(data) {
  return request({
    url: api.updateUser,
    method: 'post',
    data
  })
}
// 删除采购商服务器地址
export function purchaseDeployDelete(data) {
  return request({
    url: api.purchaseDeployDelete,
    method: 'post',
    data
  })
}
// 查询采购商服务地址
export function queryDetail(data) {
  return request({
    url: api.queryDetail,
    method: 'post',
    data
  })
}
// 查询采购商
export function merchantOrgInfoOrgPage(data) {
  return request({
    url: api.merchantOrgInfoOrgPage,
    method: 'post',
    data
  })
}
