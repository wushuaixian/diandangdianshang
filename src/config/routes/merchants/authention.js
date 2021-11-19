/*
 * @Author: your name
 * @Date: 2021-07-13 16:24:55
 * @LastEditTime: 2021-08-05 21:03:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/merchants/authention.js
 */
// 供应商
import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/authention-message',
    name: 'AuthentionMessage',
    component: RouteView,
    meta: { title: '认证管理', keepAlive: true, icon: bxAnaalyse, permission: ['AuthentionMessage'] },
    children: [
      {
        path: '/authention-message/detail',
        name: 'authention-message-detail',
        hidden: true,
        component: () => import('@/views/Suppliers/authention/detail'),
        meta: { title: '认证信息', keepAlive: true, permission: ['AuthentionMessageIndex'] }
      },
      {
        path: '/authention-message/index',
        name: 'AuthentionMessageIndex',
        component: () => import('@/views/Suppliers/authention/authention'),
        meta: { title: '认证信息', keepAlive: true, permission: ['AuthentionMessageIndex'] }
      }
    ]
  }
]
