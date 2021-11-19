/*
 * @Author: your name
 * @Date: 2021-06-22 23:16:38
 * @LastEditTime: 2021-07-01 21:15:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/purchaser.js
 */
import request from '@/utils/request'

export function getphserList(params) {
  return request({
    url: '/back-manage-web/supplierPurchaserAction/page',
    // url: '/back-manage-web/supplierPurchaserAction/sysPage',
    method: 'post',
    data: params
  })
}

// 添加认证
export function setAddPackageInfo(params) {
  return request({
    url: '/back-manage-web/package/order/tempAddPackageInfo',
    method: 'post',
    data: params
  })
}
