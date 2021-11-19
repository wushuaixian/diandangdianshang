/*
 * @Author: your name
 * @Date: 2021-07-13 16:24:55
 * @LastEditTime: 2021-07-19 12:00:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/appealManage.js
 */
import request from '@/utils/request'
// import mrequest from '@/utils/mrequest'

export function getList(params) {
  return request({
    // url: '/back-manage-web/appealAction/page',
    url: '/back-manage-web/appealAction/sysPage',
    method: 'post',
    data: params
  })
}

export function getDetail(params) {
  return request({
    url: '/back-manage-web/appealAction/detail',
    method: 'get',
    params
  })
}

export function updateAppealManage(params) {
  return request({
    url: '/back-manage-web/appealAction/update',
    method: 'post',
    data: params
  })
}

export function updateMerchantOrgInfo(params) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/update',
    method: 'post',
    data: params
  })
}

export function getAppealCount(params) {
  return request({
    url: '/back-manage-web/appealAction/appealCount',
    method: 'post',
    data: params
  })
}
