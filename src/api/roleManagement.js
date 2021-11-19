/*
 * @Author: your name
 * @Date: 2021-06-25 18:52:27
 * @LastEditTime: 2021-06-27 16:59:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/roleManagement.js
 */
import request from '@/utils/request'

const api = {
  queryRoleManagementInfo: 'back-manage-web/roleManagement/queryRoleManagementInfo',
  queryRoleManagementInfoIsPlatform: 'back-manage-web/merchantOrgInfo/detailOne'
}

/**
 * author cdd
 * description:组织名称
 * @param params
 */
export function queryRoleManagementInfoIsPlatform() {
  return request({
    url: api.queryRoleManagementInfoIsPlatform,
    method: 'get'
    // data: params
  })
}
export function queryRoleManagementInfo(data) {
  return request({
    url: api.queryRoleManagementInfo,
    method: 'post',
    data
  })
}
