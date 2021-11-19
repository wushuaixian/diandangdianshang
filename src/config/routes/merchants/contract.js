import { bxAnaalyse } from '@/core/icons'
import pendingTobeconfirmed from '../contract/pendingTobeconfirmed'
import purchaseContract from '../contract/purchaseContract'
import suppliersContract from '../contract/suppliersContract'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/contract',
    name: 'Contract',
    component: RouteView,
    meta: { title: '合同管理', keepAlive: false, icon: bxAnaalyse, permission: ['Contract'] },
    children: [...pendingTobeconfirmed, ...purchaseContract, ...suppliersContract]
  }
]
