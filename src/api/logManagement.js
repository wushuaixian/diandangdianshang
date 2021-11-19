/*
 * @Author: your name
 * @Date: 2021-07-08 20:37:56
 * @LastEditTime: 2021-07-18 19:15:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/logManagement.js
 */
import request from '@/utils/request'

const api = {
  loginLogQuery: '/back-manage-web/LoginLog/query',
  queryMerchantList: '/back-manage-web/roleManagement/queryMerchantList',
  operateRecordQuery: '/back-manage-web/operateRecord/query',
  operateRecordExport: '/back-manage-web/operateRecord/export',
  getAsyncEventInfoList: '/ouser-web/asyncexport/getAsyncEventInfoList.do'
}

/**
 * author yangjian
 * description:All Role List
 * @param params
 */
export function loginLogQuery(params) {
  return request({
    url: api.loginLogQuery,
    method: 'post',
    data: params
  })
}
/**
 * author yangjian
 * description:All Role List
 * @param params
 */
 export function queryMerchantList(params) {
  return request({
    url: api.queryMerchantList,
    method: 'get',
    params
  })
}
/**
 * author yangjian
 * description:All Role List
 * 获取操作日志
 * @param params
 */
 export function operateRecordQuery(data) {
  return request({
    url: api.operateRecordQuery,
    method: 'post',
    data
  })
}
/**
 * author yangjian
 * description:All Role List
 * 导出操作日志
 * @param params
 */
 export function operateRecordExport(data) {
  return request({
    url: api.operateRecordExport,
    method: 'post',
    data
  })
}

/**
 * author yangjian
 * description:All Role List
 * 查看任务
 * @param params
 */
 export function getAsyncEventInfoList(data) {
  return request({
    url: api.getAsyncEventInfoList,
    method: 'post',
    data
  })
}
