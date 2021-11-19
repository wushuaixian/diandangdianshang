/*
 * @Author: your name
 * @Date: 2021-07-12 13:43:09
 * @LastEditTime: 2021-07-19 11:52:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePat
 * /* eslint-disable spaced-comment */
import request from '@/utils/request'

// 获取收货地址列表
export function getAllAddressForm() {
  return request({
    url: '/ouser-web/address/getAllAddressForm.do',
    method: 'post'
  })
}
// 添加地址
export function addAddressForm(data) {
  return request({
    url: '/ouser-web/address/addAddressForm.do',
    method: 'post',
    data
  })
}
// 添加地址
export function updateAddressForm(data) {
  return request({
    url: '/ouser-web/address/updateAddressForm.do',
    method: 'post',
    data
  })
}
// 设为默认地址
export function setDefaultUserAddressForm(data) {
  return request({
    url: '/ouser-web/address/setDefaultUserAddressForm.do',
    method: 'post',
    params: data
  })
}

// 删除
export function deleteAddressForm(data) {
  return request({
    url: '/ouser-web/address/deleteAddressForm.do',
    method: 'post',
    data
  })
}

// 获取手机号
export function userMobile() {
  return request({
    url: '/ouser-web/mobileRegister/userMobile',
    method: 'get'
  })
}
