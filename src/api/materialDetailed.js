import request from '@/utils/request'
// 物料明细
const userApi = {
    materialDetailed: 'back-manage-web/material/importMaterial',
    material: 'back-manage-web/material/addMaterial',
    materialUpdate: 'back-manage-web/material/update',
    getSupplierMerchant: 'back-manage-web/merchant/getSupplierMerchant',
    materialPage: 'back-manage-web/material/page'
}
// 获取采购商接口/ merchant/getSupplierMerchant
export function getSupplierMerchant () {
    return request({
        url: userApi.getSupplierMerchant,
        method: 'post'
    })
}
// 物料明细列表接口/material/ page
export function getMaterialPage (params) {
    return request({
        url: userApi.materialPage,
        method: 'post',
        data: params
    })
}
export function materialDetailedList (params) {
    return request({
        url: userApi.materialDetailed,
        method: 'post',
        data: params
    })
}

export function materialList (params) {
    return request({
        url: userApi.material,
        method: 'post',
        data: params
    })
}

// 编辑物料类目接口
export function materialListUpdate (params) {
    return request({
        url: userApi.materialUpdate,
        method: 'post',
        data: params
    })
}
