import { bxAnaalyse } from '@/core/icons'
import approvalProcess from '../configurationCenter/approvalProcess'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/merchants-configgurationCenter',
    name: 'MerchantsConfiggurationCenter',
    component: RouteView,
    meta: { title: '配置中心', keepAlive: true, icon: bxAnaalyse, permission: ['MerchantsConfiggurationCenter'] },
    children: [...approvalProcess]
  }
]
