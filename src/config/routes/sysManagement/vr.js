import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/vr',
    name: 'Vr',
    component: RouteView,
    meta: { title: 'VR管理', keepAlive: true, icon: bxAnaalyse, permission: ['Vr'] },
    children: [
      {
        path: '/vr/material',
        name: 'vr-material',
        component: () => import('@/views/sysManagement/vr/material/index'),
        meta: { title: '素材库', keepAlive: true, permission: ['vr-material'] }
      },
      // {
      //   path: '/vr/hoticon',
      //   name: 'vr-hoticon',
      //   component: () => import('@/views/sysManagement/vr/hoticon/index'),
      //   meta: { title: '热点管理', keepAlive: true, permission: ['SupplierList'] }
      // },
      {
        path: '/vr/editList',
        name: 'vr-editList',
        component: () => import('@/views/sysManagement/vr/editList/index'),
        meta: { title: 'VR编辑列表', keepAlive: true, permission: ['vr-editList'] }
      },
      {
        path: '/vr/examine',
        name: 'vr-examine',
        component: () => import('@/views/sysManagement/vr/examine/index'),
        meta: { title: 'VR编辑审核', keepAlive: true, permission: ['vr-examine'] }
      }
    ]
  }
]
