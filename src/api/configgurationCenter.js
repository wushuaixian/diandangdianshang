/*
 * @Author: your name
 * @Date: 2021-06-20 10:47:15
 * @LastEditTime: 2021-06-21 18:51:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/configgurationCenter.js
 */
import request from '@/utils/request'

// 平台寻源保证金-查询
export function findPlatformSourceDeposit(data) {
  return request({
    url: '/back-manage-web/depositConfig/findPlatformSourceDeposit.do',
    method: 'post',
    data: data
  })
}

// 平台寻源保证金-新增
export function savePlatformSourceDeposit(data) {
  return request({
    url: '/back-manage-web/depositConfig/savePlatformSourceDeposit.do',
    method: 'post',
    data: data
  })
}

// 平台寻源保证金操作日志-查询
export function findPlatformSourceDepositLog(data) {
  return request({
    url: '/back-manage-web/depositConfigLog/findPlatformSourceDepositLog.do',
    method: 'post',
    data: data
  })
}
// 平台寻源保证金-查询(采购商维度)
export function findBuyerSourceDeposit(data) {
  return request({
    url: '/back-manage-web/depositConfig/findBuyerSourceDeposit.do',
    method: 'post',
    data: data
  })
}
// 平台寻源保证金-删除(采购商维度)
export function deleteBuyerSourceDepositById(data) {
  return request({
    url: '/back-manage-web/depositConfig/deleteBuyerSourceDepositById.do',
    method: 'post',
    data: data
  })
}
// 平台寻源采购商列表-查询(采购商维度)
export function merchantOrgInfo(data) {
  return request({
    url: '/back-manage-web/merchantOrgInfo/orgPage.do',
    method: 'post',
    data: data
  })
}
// 平台寻源采购商列表-查询(采购商维度t通过Id)
export function findBuyerSourceDepositById(data) {
  return request({
    url: '/back-manage-web/depositConfig/findBuyerSourceDepositById.do',
    method: 'post',
    data: data
  })
}
// 平台寻源采购商列表-查询(日志-查找)
export function findSupplierSourceDepositLog(data) {
  return request({
    url: '/back-manage-web/depositConfigLog/findSupplierSourceDepositLog.do',
    method: 'post',
    data: data
  })
}
// 平台寻源采购商列表-查询(查找)
export function findSupplierSourceDeposit(data) {
  return request({
    url: '/back-manage-web/depositConfig/findSupplierSourceDeposit.do',
    method: 'post',
    data: data
  })
}
// 平台寻源采购商列表-查询(修改)
export function updateSupplierSourceDeposit(data) {
  return request({
    url: '/back-manage-web/depositConfig/updateSupplierSourceDeposit.do',
    method: 'post',
    data: data
  })
}
// 平台寻源采购商列表-新增(新建保证金下限额度)
export function saveBuyerSourceDeposit(data) {
  return request({
    url: '/back-manage-web/depositConfig/saveBuyerSourceDeposit.do',
    method: 'post',
    data
  })
}

// 平台寻源采购商列表-新增(修改保证金下限额度)
export function updateBuyerSourceDeposit(data) {
  return request({
    url: '/back-manage-web/depositConfig/updateBuyerSourceDeposit.do',
    method: 'post',
    data
  })
}
// 查询供应商保证金上线金额
export function selectCategoryPO(data) {
  return request({
    url: '/back-manage-web/deposit/selectCategoryPO.do',
    method: 'post',
    data
  })
}
// 查询供应商保证金上线金额
export function selectCategoryLogByQuery(data) {
  return request({
    url: '/back-manage-web/depositLog/selectCategoryLogByQuery.do',
    method: 'post',
    data
  })
}
// 新增、更新类目供应商保证金上限金额接口
export function updataCategoryPO(data) {
  return request({
    url: '/back-manage-web/deposit/updataCategoryPO.do',
    method: 'post',
    data
  })
}

// 查询平台统一标书费
export function findUnifyTenderPO() {
  return request({
    url: '/back-manage-web/unifyTender/findUnifyTenderPO.do',
    method: 'post'
  })
}
// 平台统一标书费-保存/更新
export function SaveUnifyTenderPO(data) {
  return request({
    url: '/back-manage-web/unifyTender/SaveUnifyTenderPO.do',
    method: 'post',
    data
  })
}
// 查询平台统一标书费操作日志
export function selectUnifyTenderLogPO(data) {
  return request({
    url: '/back-manage-web/unifyTenderLog/selectUnifyTenderLogPO.do',
    method: 'post',
    data
  })
}
// 查询平台统一标书费操作日志
export function selectAll(data) {
  return request({
    url: '/back-manage-web/tender/selectAll.do',
    method: 'post',
    data
  })
}

// 查询平台统一标书费新增
export function tenderAdd(data) {
  return request({
    url: '/back-manage-web/tender/add.do',
    method: 'post',
    data
  })
}
// 查询平台统一标书费删除
export function deleteByIds(data) {
  return request({
    url: '/back-manage-web/tender/deleteByIds.do',
    method: 'post',
    data
  })
}
// 查询平单个
export function selectOneTenderById(data) {
  return request({
    url: '/back-manage-web/tender/selectOneTenderById.do',
    method: 'post',
    data
  })
}
// 修改标书费配置
export function tenderUpdate(data) {
  return request({
    url: '/back-manage-web/tender/update.do',
    method: 'post',
    data
  })
}
// 罚扣保证金-查询比例
export function findDepositPOIsFK() {
  return request({
    url: '/back-manage-web/deposit/findDepositPOIsFK.do',
    method: 'post'
  })
}
// 罚扣保证金-保存比例
export function SaveDepositPOIsFK(data) {
  return request({
    url: '/back-manage-web/deposit/SaveDepositPOIsFK.do',
    method: 'post',
    data
  })
}
// 罚扣保证金-操作日志
export function selectAllFKLog(data) {
  return request({
    url: '/back-manage-web/depositLog/selectAllFKLog.do',
    method: 'post',
    data
  })
}
