/*
 * @Author: your name
 * @Date: 2021-07-26 17:37:08
 * @LastEditTime: 2021-07-26 19:44:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/configgurationCenter/menuPathConfiguration.js
 */
import request from '@/utils/request'
// .查询平台下所有菜单
export function getAllFunctionByPlatform(data) {
  return request({
    url: '/ouser-web/function/getAllFunctionByPlatform',
    method: 'post',
    data
  })
}
// 获取单个
export function getFunctionById(data) {
  return request({
    url: '/ouser-web/function/getFunctionById',
    method: 'post',
    data
  })
}
//  更新
export function updateFunction(data) {
  return request({
    url: '/ouser-web/function/updateFunction',
    method: 'post',
    data
  })
}

// 添加
export function saveFunction(data) {
  return request({
    url: '/ouser-web/function/saveFunction',
    method: 'post',
    data
  })
}
