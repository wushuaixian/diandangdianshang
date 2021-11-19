/*
 * @Author: your name
 * @Date: 2021-07-25 14:52:21
 * @LastEditTime: 2021-07-25 14:53:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/serve/index.js
 */
import request from '@/utils/request'
// 获取支持客服信息
export function getCsTekGroupIdaa (data) {
  return request({
    url: '/ouser-web/queryAction/getCsTekGroupId',
    method: 'post',
    data
  })
}
