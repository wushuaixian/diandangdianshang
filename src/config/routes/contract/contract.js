/*
 * @Author: your name
 * @Date: 2021-08-01 15:32:17
 * @LastEditTime: 2021-08-04 20:06:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/contract/contract.js
 */
// 采购商
import { bxAnaalyse } from '@/core/icons'
// import pendingApproval from './pendingApproval'
import pendingTobeconfirmed from './pendingTobeconfirmed'
import purchaseContract from './purchaseContract'
import suppliersContract from './suppliersContract'
// import contractsSigned from './contractsSigned'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/contract',
    name: 'SysContract',
    component: RouteView,
    meta: { title: '合同管理', keepAlive: false, icon: bxAnaalyse, permission: ['SysContract'] },
    children: [
      // ...pendingApproval,
      ...pendingTobeconfirmed,
      ...purchaseContract,
      ...suppliersContract
      // ...contractsSigned
    ]
  }
]
