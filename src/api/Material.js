/*
 * @Author: your name
 * @Date: 2021-06-25 18:52:27
 * @LastEditTime: 2021-06-25 19:32:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/Material.js
 */
import request from '@/utils/request'
// 物料类目列表接口
export function MaterialCateGory (params) {
    return request({
        url: '/back-manage-web/materialcategory/all',
        method: 'GET',
        params
    })
}
// 物料类添加接口
export function AddiTion (data) {
    return request({
        url: '/back-manage-web/materialcategory/add',
        method: 'POST',
        data
    })
}
// 物料类目编辑接口
export function Editors (data) {
    return request({
        url: '/back-manage-web/materialcategory/update',
        method: 'POST',
        data
    })
}
// 物料类目调整顺序接口
export function Order (data) {
    return request({
        url: `/back-manage-web/materialcategory/setOrder?id=${data.id}&merchantId=${data.merchantId}&direct=${data.direct}`,
        method: 'POST',
        data
    })
}
// 物料类目Excel导入接口
export function Excel (data) {
    return request({
        url: '/back-manage-web/materialcategory/importMaterial',
        method: 'POST',
        data
    })
}
