import request from '@/utils/request'

const userApi = {
  sendEnterCaptchas: 'mobileRegister/sendEnterCaptchas',
  checkCaptchas: 'mobileRegister/checkCaptchas',
  // eslint-disable-next-line no-dupe-keys
  checkCaptchas: 'mobileLogin/checkUserName',
  companyQuery: '/yidun/company/query',
  getBasicInfo: '/yidun/company/getBasicInfo',
  ocrBusinessLicense: '/aliyun/ocr/ocrBusinessLicense',
  uploadFile: '/media/uploadFile'
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
export function sendEnterCaptchas(parameter) {
  return request({
    url: userApi.sendEnterCaptchas,
    method: 'post',
    data: parameter
  })
}

/**
 * 校验验证码
 * @param {*} parameter
 * @returns
 */
export function checkCaptchas(parameter) {
  return request({
    url: userApi.checkCaptchas,
    method: 'post',
    data: parameter
  })
}
/**
 * 模糊查询企业名称
 * @param {*} parameter
 * @returns
 */
export function companyQuery(keyword) {
  return request({
    url: userApi.companyQuery,
    method: 'post',
    data: {
      keyword: keyword
    }
  })
}
/**
 * 根据企业名称查询企业信息
 * @param {*} parameter
 * @returns
 */
export function getBasicInfo(keyword) {
  return request({
    url: userApi.getBasicInfo,
    method: 'post',
    data: {
      keyword: keyword
    }
  })
}

/**
 * 根据图片查询企业信息
 * @param {*} parameter
 * @returns
 */
export function ocrBusinessLicense(imagePath) {
  return request({
    url: userApi.ocrBusinessLicense,
    method: 'post',
    data: {
      imagePath: imagePath
    }
  })
}

/**
 * 根据图片查询企业信息
 * @param {*} parameter
 * @returns
 */
export function uploadFile(imagePath) {
  return request({
    url: userApi.uploadFile,
    method: 'post',
    data: {
      imagePath: imagePath
    }
  })
}
