import request from '@/utils/request'

const userApi = {
  // supplier: '/ouser-web/merchantOrgInfo/pageMerchantOrgInfo'
  queryContractPurchaseSign: '/back-manage-web/contractPurchase/queryContractPurchaseSign'

}

// 采购待签合同列表
export function queryContractPurchaseSign(params) {
  return request({
    url: userApi.queryContractPurchaseSign,
    method: 'POST',
    data: params
  })
}
