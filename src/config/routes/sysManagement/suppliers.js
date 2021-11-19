/*
 * @Author: your name
 * @Date: 2021-07-13 16:24:55
 * @LastEditTime: 2021-08-04 22:55:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/sysManagement/suppliers.js
 */
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/suppliers-manage',
    name: 'SuppliersManage',
    meta: { title: '供应商管理', icon: bxAnaalyse, keepAlive: true, permission: ['SupplierManage'] },
    component: RouteView,
    children: [
      {
        path: '/suppliers-manage/list',
        name: 'SuppliersManageList',
        component: () => import('@/views/sysManagement/suppliers/manage/list'),
        meta: {
          title: '供应商列表',
          keepAlive: false,
          hiddenHeaderContent: true,
          permission: ['SuppliersManageList']
        }
      },
      {
        path: '/suppliers-manage/detail/:id',
        name: 'SuppliersManageDetail',
        component: () => import('@/views/sysManagement/suppliers/manage/detail'),
        hidden: true,
        meta: { title: '供应商详情', permission: ['SuppliersManageList'] }
      },
      {
        path: '/suppliers-manage/suppliers-audit-details',
        name: 'SuppliersAuditDetails',
        hidden: true,
        meta: { title: '准入审核详情页', keepAlive: true, permission: ['SuppliersAuditList'] },
        component: () => import('@/views/sysManagement/suppliers/audit/Details.vue')
      },
      {
        path: '/suppliers-manage/suppliers-audit-list',
        name: 'SuppliersAuditList',
        meta: { title: '供应商准入审核', keepAlive: true, permission: ['SuppliersAuditList'] },
        component: () => import('@/views/sysManagement/suppliers/audit/Examine.vue')
      },
      {
        path: '/suppliers-manage/suppliers-certification-list',
        name: 'SuppliersCertificationList',
        meta: { title: '供应商认证管理', keepAlive: true, permission: ['SuppliersCertificationList'] },
        component: () => import('@/views/sysManagement/suppliers/certification/list.vue')
      },
      {
        path: '/suppliers-manage/suppliers-certification-detail/:id',
        hidden: true,
        name: 'SuppliersCertificationDetail',
        meta: { title: '供应商认证管理详情', keepAlive: true, permission: ['SuppliersCertificationList'] },
        component: () => import('@/views/sysManagement/suppliers/certification/detail.vue')
      },
      {
        path: '/suppliers-manage/suppliers-certification-aduti-list',
        name: 'SuppliersCertificationAuditList',
        component: () => import('@/views/sysManagement/suppliers/certificationAudit/list'),
        meta: { title: '供应商认证审核', keepAlive: true, permission: ['SuppliersCertificationAuditList'] }
      },
      {
        path: '/suppliers-manage/suppliers-certification-aduti-detail',
        name: 'SuppliersCertificationAuditDetail',
        component: () => import('@/views/sysManagement/suppliers/certificationAudit/detail'),
        hidden: true,
        meta: { title: '供应商认证详情', keepAlive: true, permission: ['SuppliersCertificationAuditList'] }
      },
      {
        path: '/suppliers-manage/suppliers-statistics',
        name: 'SuppliersStatistics',
        component: () => import('@/views/sysManagement/suppliers/statistics/index.vue'),
        meta: { title: '供应商统计报表', keepAlive: true, permission: ['SuppliersStatistics'] }
      },
      {
        path: '/suppliers-manage/category-audit-list',
        name: 'CategoryAuditList',
        component: () => import('@/views/sysManagement/suppliers/categoryAudit/list'),
        meta: { title: '品类审核', keepAlive: true, permission: ['CategoryAuditList'] }
      },
      {
        path: '/suppliers-manage/category-audit-detail/:id',
        hidden: true,
        name: 'CategoryAuditDetail',
        component: () => import('@/views/sysManagement/suppliers/categoryAudit/details'),
        meta: { title: '品类审核详情', keepAlive: true, permission: ['CategoryAuditList'] }
      }
    ]
  }
]
