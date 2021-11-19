/*
 * @Author: your name
 * @Date: 2021-06-28 23:59:05
 * @LastEditTime: 2021-06-29 15:40:17
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/supplierCollection.js
 */
import request from '@/utils/request'

const userApi = {
  Supplier: '/back-manage-web/supplierPurchaserAction/page'
  // Supplier: '/back-manage-web/supplierPurchaserAction/sysPage'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
// 供应商管理
export function postSupplier (params) {
  return request({
    url: userApi.Supplier,
    method: 'post',
    data: params
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
