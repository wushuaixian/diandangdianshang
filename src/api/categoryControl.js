/*
 * @Author: your name
 * @Date: 2021-06-25 18:52:27
 * @LastEditTime: 2021-06-28 17:00:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/categoryControl.js
 */
import request from '@/utils/request'

const api = {
  queryCategoryTreeMenu: '/back-manage-web/categoryControl/queryCategoryTreeMenu',
  queryUsers: '/back-manage-web/categoryControl/queryUsers',
  updateCategoryControlInfo: '/back-manage-web/categoryControl/updateCategoryControlInfo',
  updateCategory: '/back-product-web/back/mp/category/updateCategory',
  addCategoryChild: '/back-product-web/back/mp/category/addCategoryChild',
  updateCategorySort: '/back-product-web/back/mp/category/updateCategorySort'
}

/**
 * author cdd
 * description:Get Category menu
 * @param params
 */
export function queryCategoryTreeMenu(params) {
  return request({
    url: api.queryCategoryTreeMenu,
    method: 'get',
    params: params
  })
}

/**
 * author cdd
 * description:获取 关联类目负责人 列表
 * @param params
 */
export function queryUsers(params) {
  return request({
    url: api.queryUsers,
    method: 'post',
    data: params
  })
}

/**
 * author:cdd
 * description:Update category Control Info
 * @param params
 */
export function updateCategoryControlInfo(params) {
  return request({
    url: api.updateCategoryControlInfo,
    method: 'post',
    data: params
  })
}
// 编辑商品类目
export function updateCategory(data) {
  return request({
    url: api.updateCategory,
    method: 'post',
    data
  })
}
// 添加商品类目
export function addCategoryChild(data) {
  return request({
    url: api.addCategoryChild,
    method: 'post',
    data
  })
}
// 更改商品类目
export function updateCategorySort(data) {
  return request({
    url: api.updateCategorySort,
    method: 'post',
    data
  })
}
