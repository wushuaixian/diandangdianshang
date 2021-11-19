// 计划管理
import { bxAnaalyse } from '@/core/icons'
import matterRoute from './matter'
import purchaseRoute from './purchase'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/plan-manage',
    name: 'MerchantsPlanManage',
    component: RouteView,
    meta: { title: '计划管理', keepAlive: true, icon: bxAnaalyse, permission: ['MerchantsPlanManage'] },
    children: [...matterRoute, ...purchaseRoute]
  }
]
