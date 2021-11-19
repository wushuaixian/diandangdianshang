/*
 * @Author: your name
 * @Date: 2021-07-13 16:24:55
 * @LastEditTime: 2021-08-07 17:24:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/merchants/package.js
 */
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/package',
    name: 'PackageManege',
    component: RouteView,
    meta: {
      title: 'VIP套餐',
      keepAlive: true,
      icon: bxAnaalyse,
      permission: ['PackageManege']
    },
    children: [
      {
        path: '/package/apply',
        name: 'PackageApply',
        component: () => import('@/views/Suppliers/package/apply'),
        meta: { title: '增值服务', permission: ['PackageDetail'] }
      },
      {
        path: '/package/apply-detail',
        name: 'PackageBuyRecord',
        component: () => import('@/views/Suppliers/package/log'),
        meta: {
          title: '购买记录',
          keepAlive: true,
          hidden: true,
          permission: ['PackageBuyRecord']
        }
      }
    ]
  }
]
