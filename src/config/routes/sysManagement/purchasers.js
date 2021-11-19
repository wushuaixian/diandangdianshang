/*
 * @Author: your name
 * @Date: 2021-06-22 23:16:38
 * @LastEditTime: 2021-08-03 15:41:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/sysManagement/purchasers.js
 */
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/purchasers-manage',
    name: 'PurchasersManage',
    meta: { title: '采购商管理', icon: bxAnaalyse, keepAlive: true, permission: ['PurchaseManage'] },
    component: RouteView,
    children: [
      {
        path: '/purchasers-manage/list',
        name: 'PurchaserMnageList',
        component: () => import('@/views/sysManagement/purchasers/manage/list'),
        meta: { title: '采购商列表', permission: ['PurchaserMnageList'] }
      },
      {
        path: '/purchasers-manage/detail/:id',
        name: 'PurchaserManageDetail',
        component: () => import('@/views/sysManagement/purchasers/manage/detail'),
        hidden: true,
        meta: {
          title: '采购商详情',
          permission: ['PurchaserMnageList']
        }
      },
      {
        path: '/purchasers-manage/purchasers-audit-detail',
        name: 'PurchasersAuditDetails',
        hidden: true,
        meta: { title: '准入审核详情页', keepAlive: true, permission: ['PurchasersAuditList'] },
        component: () => import('@/views/sysManagement/purchasers/audit/Details.vue')
      },
      {
        path: '/purchasers-manage/purchasers-audit-list',
        name: 'PurchasersAuditList',
        meta: { title: '采购商准入审核', keepAlive: true, permission: ['PurchasersAuditList'] },
        component: () => import('@/views/sysManagement/purchasers/audit/Examine.vue')
      }
    ]
  }
]
