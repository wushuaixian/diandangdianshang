// 保证金管理
import request from '@/utils/request'

// export function getFuncList() {
//     return request({
//         url: '/back-manage-web/myContract/getContractVariable.do',
//         method: 'get'
//     })
// }
// 平台保证金查询数据请求
export function MarginInquiry(data) {
    return request({
        url: '/depositConfig/findPlatformSourceDeposit',
        method: 'post',
        data: data
    })
}
