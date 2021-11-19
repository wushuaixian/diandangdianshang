import request from '@/utils/request'

const userApi = {
  Apply: '/back-manage-web/package/order/query/id',
  ApplyAdd: '/back-manage-web/package/order/add'
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

export function postApplyAdd(params) {
  return request({
    url: userApi.ApplyAdd,
    method: 'post',
    data: params
  })
}
