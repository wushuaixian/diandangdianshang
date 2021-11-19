// 供应商
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/userManagement',
    name: 'UserManage',
    component: RouteView,
    meta: { title: '用户管理', keepAlive: true, icon: bxAnaalyse, permission: ['UserManage'] },
    children: [
      {
        path: '/userManagement/index',
        name: 'UserManageList',
        hidden: true,
        component: () => import('@/views/userManagement/index'),
        meta: { title: '企业用户', keepAlive: true, permission: ['UserManageList'] }
      }
    ]
  }
]
