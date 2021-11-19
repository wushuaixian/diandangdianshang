/*
 * @Author: your name
 * @Date: 2021-08-04 19:27:27
 * @LastEditTime: 2021-08-04 22:55:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/operatedConfigure/SupplierRating/index.js
 */
// import GradeSettings from './GradeSettings'
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/SupplierRating',
    name: 'SupplierRating',
    component: RouteView,
    meta: { title: '供应商评级', icon: bxAnaalyse, permission: ['SupplierRating'] },
    children: [
      {
        path: '/SupplierRatingSeach',
        name: 'SupplierRatingSeach',
        component: () => import('@/views/SupplierRating/SupplierRatingSeach'),
        meta: { title: '供应商评级查询', keepAlive: true, permission: ['SupplierRatingSeach'] }
      },
      {
        path: '/AuditListOfSupplierPromotion',
        name: 'AuditListOfSupplierPromotion',
        component: () => import('@/views/SupplierRating/AuditListOfSupplierPromotion'),
        meta: { title: '供应商调级审核列表', keepAlive: true, permission: ['SupplierRatingSeach'] }
      },
      {
        path: '/SupplierRatingSeach/Summary/:id',
        name: 'Summary',
        component: () => import('@/views/SupplierRating/componentFrom/Summary.vue'),
        meta: { title: '评分汇总', keepAlive: true, permission: ['SupplierRatingSeach'] },
        hidden: true
      },
      {
        path: '/SupplierRatingSeach/Summary/detailed/:id/:seach',
        name: 'detailed',
        component: () => import('@/views/SupplierRating/componentFrom/detailed'),
        meta: { title: '详情页', keepAlive: true, permission: ['SupplierRatingSeach'] },
        hidden: true
      }
    ]
  }
]
