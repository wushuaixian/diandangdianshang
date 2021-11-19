import request from '@/utils/request'

const userApi = {
  sendCaptchas: '/ouser-web/mobileRegister/sendCaptchas',
  checkCaptchas: '/ouser-web/mobileRegister/checkCaptchas',
  checkUserName: '/ouser-web/mobileLogin/checkUserName',
  companyQuery: '/back-manage-web/yidun/company/query',
  getBasicInfo: '/back-manage-web/yidun/company/getBasicInfo',
  ocrBusinessLicense: '/back-manage-web/aliyun/ocr/ocrBusinessLicense',
  uploadFile: '/ouser-web/media/fileUploadToKsy',
  queryMerAllCategory: '/back-manage-web/category/queryAllCategory',
  enterpriseRegister: '/ouser-web/mobileRegister/enterpriseRegister',
  login: '/ouser-web/mobileLogin/enterLogin',
  getMerchantOrgInfoByOrgId: '/back-manage-web/merchantOrgInfo/getMerchantOrgInfoByOrgId',
  isRepeatPhoneForm: '/ouser-web/mobileRegister/isRegisterPhone',
  logout: '/ouser-web/mobileLogin/exit.do',
  queryRoleToOperate: '/ouser-web/user/queryRoleToOperate.do'
}

/**
 * 用户登录
 * parameter: {
 *   "mobile":"",手机号
 *   "captchas":"",验证码
 *   "userName":"xiaoliu",用户名
 *   "password":"123456",密码
 *   "platformId":"21"
 * }
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return request({
    url: userApi.login,
    method: 'post',
    data: parameter
  })
}

/**
 * 登出
 * @returns
 */
export function logout() {
  return request({
    url: userApi.logout,
    method: 'post'
  })
}

/**
 * 发送验证码
 * parameter: {
 *     mobile:String '手机号',
 *     type:String '验证码类型（1.登录，2.注册）',
 * }
 * @param parameter
 * @returns {*}
 */
export function sendCaptchas(mobile, type) {
  return request({
    url: userApi.sendCaptchas,
    method: 'post',
    data: {
      mobile: mobile,
      type: type
    }
  })
}

/**
 * 校验验证码
 * type:String '验证码类型（1.登录，2.注册）',
 * mobile:String '手机号'，
 * captchas:String '验证码'
 * @param {*} parameter
 * @returns
 */
export function checkCaptchas(mobile, captchas, type) {
  return request({
    url: userApi.checkCaptchas,
    method: 'post',
    data: {
      mobile: mobile,
      captchas: captchas,
      type: type
    }
  })
}
/**
 * 用户名/手机号查重
 * 1
 * @param {*} parameter
 * @returns
 */
export function checkUserName(parameter) {
  return request({
    url: userApi.checkUserName,
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
    method: 'get',
    params: {
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
    method: 'get',
    params: {
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
    method: 'get',
    params: {
      imagePath: imagePath
    }
  })
}

/**
 * 上传图片
 * @param {*} parameter
 * @returns
 */
export function uploadFile(file) {
  const data = new FormData()
  data.append('Filedata', file)
  return request({
    url: userApi.uploadFile,
    method: 'post',
    data: data
  })
}
/**
 * 获取主营品类
 * @param {*} parameter
 * @returns
 */
export function queryMerAllCategory() {
  return request({
    url: userApi.queryMerAllCategory,
    method: 'get'
  })
}
/**
 * 获取主营品类树形结构
 * @param {*} parameter
 * @returns
 */
export function queryTreeAllCategory() {
  return request({
    url: '/back-manage-web/category/queryOneToThree',
    method: 'get'
  })
}

/**
 * 提交注册信息
 * {
    "username":"用户名",
    "password":"密码",
	  "mobile":"手机号",
    "userRole":"用户类型（1.我是销售 2.我是采购 3.两者都是）",
    "captchas":"验证码",
    "inviteCode":"邀请码",
    "enterpriseNature":"企业性质（1.生产商，2.贸易商）",
    "categoryId":"类目ID",
	  "powerOfAttorneyUrl":"委托书url",
	  "businessLicenceUrl":"营业执照URL"
    "legalPersonNameOcr":"法人姓名ocr","person"
    "registeredDetailAddressOcr":"注册的详细地址ocr","address"
	  "registeredRegionNameOcr":"注册的区名ocr",
    "registeredCityNameOcr":"注册的市名ocr",
    "registeredProvinceNameOcr":"注册的省名ocr",
    "currencyOcr":"注册币种ocr",
    "registeredCapitalOcr":"注册资金ocr","capital"
	  "businessLicencePeriodEndOcr":"工商局注册结束日期ocr","valid_period"
    "businessLicencePeriodBeginOcr":"工商局开始日期ocr",
    "enterpriseTypeOcr":"企业类型ocr","type"
    "businessLicenceRegisterOcr":"注册日期","establish_date"
    "businessLicenceNoOcr":"统一社会信用代码ocr","reg_num"
    "businessScopeOcr":"营业范围ocr","business"
	  "enterpriseNameOcr":"企业名称ocr","name"
    "legalPersonName":"法人姓名",legalRepresentative
    "registeredDetailAddress":"注册的详细地址",registerPlace
    "registeredRegionName":"注册的区名",registerCounty
    "registeredCityName":"注册的市名",registerCity
	  "registeredProvinceName":"注册的省名",registerProvince
    "currency":"注册币种",registerCapitalCurrency
    "registeredCapital":"注册资金",registerCapitalValue
    "enterpriseType":"企业类型",orgType
    "businessLicenceRegister":"注册日期",registerDate
    "businessLicencePeriodBegin":工商局注册开始日期,oprtStartDate
    "businessLicencePeriodEnd":"工商局注册结束日期",oprtEndDate
	  "businessLicenceNo":"统一社会信用代码",ucCode
	  "businessScope":"营业范围",oprtScope
	  "enterpriseName":"企业名称",orgName
}
 * @param {*} parameter
 * @returns
 */
export function enterpriseRegister(parameter) {
  return request({
    url: userApi.enterpriseRegister,
    method: 'post',
    data: parameter
  })
}

export function getMerchantOrgInfoByOrgId(params) {
  return request({
    url: userApi.getMerchantOrgInfoByOrgId,
    method: 'get',
    data: params
  })
}

export function getUserIdentityPlatformList(params) {
  return request({
    url: '/ouser-web/platform/getUserPlatformList.do',
    method: 'post',
    data: params
  })
}
export function refreshFrontPlatform(params) {
  return request({
    url: '/ouser-web/platform/refreshFrontPlatform',
    method: 'get',
    params
  })
}

export function getUserInfo(params) {
  return request({
    url: '/ouser-web/mobileLogin/getUserInfo.do',
    method: 'get',
    params
  })
}

export function isRepeatPhoneForm(params) {
  return request({
    url: userApi.isRepeatPhoneForm,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function queryRoleToOperate(params) {
  return request({
    url: userApi.queryRoleToOperate,
    method: 'post',
    data: params
  })
}

// 重新设置密码
export function changeSetPasswd(params) {
  return request({
    url: '/ouser-web/mobileRegister/modifyPassword',
    method: 'post',
    data: params
  })
}
// 查看手机号是否注册
export function checkUserPhone(params) {
  return request({
    url: '/ouser-web/mobileLogin/checkUserName1',
    method: 'post',
    data: params
  })
}

// 获取手机号
export function userMobile() {
  return request({
    url: '/ouser-web/mobileRegister/userMobile',
    method: 'get'
  })
}
// 换绑手机号
export function updateMobile(data) {
  return request({
    url: '/ouser-web/mobileRegister/updateMobile',
    method: 'post',
    data
  })
}
