/*
 * @Author: your name
 * @Date: 2021-06-26 21:39:10
 * @LastEditTime: 2021-08-07 14:52:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/api/accessAudit.js
 */
import request from '@/utils/request'

const userApi = {
  QueryPage: '/back-manage-web/admittanceAuditAction/page',
  Query: '/back-manage-web/admittanceAuditAction/sysPage',
  submitExamine: '/back-manage-web/admittanceAuditAction/batchSubmit',
  ExamineDetails: '/back-manage-web/admittanceAuditAction/detailProofread',
  getBasicInfoSplicingUrl: '/back-manage-web/yidun/company/getBasicInfoSplicingUrl',
  viewApprovalComments: '/back-manage-web/admittanceAuditAction/viewApprovalComments',
  operateRecordInfo: '/back-manage-web/operateRecord/info',
  resendAllinpay: '/back-manage-web/account/resendAllinpay'
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

export function viewApprovalComments(parameter) {
  return request({
    url: userApi.viewApprovalComments,
    method: 'post',
    data: parameter
  })
}
export function accessAuditQuyery(parameter) {
  return request({
    url: userApi.Query,
    method: 'post',
    data: parameter
  })
}
export function accessAuditQuyeryPage(parameter) {
  return request({
    url: userApi.QueryPage,
    method: 'post',
    data: parameter
  })
}
// 审核提交
export function submitExamine(parameter) {
  return request({
    url: userApi.submitExamine,
    method: 'post',
    data: parameter
  })
}
export function getBasicInfoSplicingUrl(parameter) {
  return request({
    url: userApi.getBasicInfoSplicingUrl,
    method: 'get',
    params: parameter
  })
}

export function resendAllinpay(parameter) {
  return request({
    url: userApi.resendAllinpay,
    method: 'get',
    params: parameter
  })
}

export function ExamineDetails(parameter) {
  return request({
    url: userApi.ExamineDetails,
    method: 'post',
    data: parameter
  })
}
export function operateRecordInfo(parameter) {
  return request({
    url: userApi.operateRecordInfo,
    method: 'post',
    data: parameter
  })
}

// button防抖
export const DebounceBy = (fn, t) => {
  const delay = t || 500
  let timer
  return function() {
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }

    const callNow = !timer

    timer = setTimeout(() => {
      timer = null
    }, delay)

    if (callNow) fn.apply(this, args)
  }
}
