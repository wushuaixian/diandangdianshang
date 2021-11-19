/*
 * @Author: your name
 * @Date: 2021-06-25 18:52:27
 * @LastEditTime: 2021-06-25 23:45:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/position.js
 */
import request from '@/utils/request'

const api = {
  queryPositionLists: '/ouser-web/position/queryPositionLists',
  addPosition: '/ouser-web/position/addPosition',
  updatePosition: '/ouser-web/position/updatePosition',
  deletePosition: '/ouser-web/position/deletePosition'
}

/**
 * author cdd
 * description:Post List
 * @param params
 */
export function queryPositionLists(params) {
  return request({
    url: api.queryPositionLists,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description:add position
 * @param params
 */
export function addPosition(params) {
  return request({
    url: api.addPosition,
    method: 'post',
    data: params
  })
}

/**
 * author cdd
 * description:Delete position
 * @param params
 */
export function deletePosition(params) {
  return request({
    url: api.deletePosition,
    method: 'post',
    data: params
  })
}

/**
 * aurhor cdd
 * description:Update position
 * @param params
 */
export function updatePosition(params) {
  return request({
    url: api.updatePosition,
    method: 'post',
    data: params
  })
}
