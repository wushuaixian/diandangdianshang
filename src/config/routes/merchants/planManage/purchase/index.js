/*
 * @Author: your name
 * @Date: 2021-08-01 15:32:17
 * @LastEditTime: 2021-08-01 20:10:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/merchants/planManage/purchase/index.js
 */
// 物料管理
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/plan-manage/purchase-manage',
    name: 'MerchantsPurchaseManage',
    component: RouteView,
    meta: { title: '采购计划', keepAlive: true, icon: bxAnaalyse, permission: ['MerchantsPurchaseManage'] },
    children: [
      {
        path: '/plan-manage/purchase-manage/create-order',
        name: 'MerchantsPurchaseManagCreateOrder',
        hidden: true,
        component: () => import('@/views/Suppliers/planManage/createOrder/'),
        meta: { title: '创建订单', keepAlive: true, permission: ['MerchantsPurchaseManage'] }
      },
      {
        path: '/plan-manage/purchase-manage/create-plan',
        name: 'MerchantsPurchaseManagCreatePlan',
        component: () => import('@/views/Suppliers/planManage/plannewplan/newplan'),
        meta: { title: '新建计划', keepAlive: true, permission: ['MerchantsPurchaseManagCreatePlan'] }
      },
      {
        path: '/plan-manage/purchase-manage/istribution',
        name: 'MerchantsPurchaseManageIstribution',
        component: () => import('@/views/Suppliers/planManage/istributions/istribution'),
        meta: { title: '计划分配', keepAlive: true, permission: ['MerchantsPurchaseManageIstribution'] }
      },
      {
        path: '/plan-manage/purchase-manage/implement',
        name: 'MerchantsPurchaseManagCarry',
        component: () => import('@/views/Suppliers/planManage/implement/list'),
        meta: { title: '计划执行', keepAlive: true, permission: ['MerchantsPurchaseManagCarry'] }
      },
      {
        path: '/plan-manage/purchase-manage/plan-detail',
        name: 'MerchantsPurchaseManagPlanDetail',
        hidden: true,
        component: () => import('@/views/Suppliers/planManage/plannewplan/planDetail'),
        meta: { title: '计划详情', keepAlive: true, permission: ['MerchantsPurchaseManagCreatePlan'] }
      },
      {
        path: '/plan-manage/purchase-manage/foundSearch',
        name: 'MerchantsPurchaseManagFoundSearch',
        hidden: true,
        component: () => import('@/views/Suppliers/planManage/projectCarry/foundSearch'),
        meta: { title: '创建寻源', keepAlive: true, permission: ['MerchantsPurchaseManagCarry'] }
      },
      // {
      //   path: '/plan-manage/purchase-manage/MaterialCode',
      //   name: 'MerchantsPurchaseManagMaterialCode',
      //   hidden: true,
      //   component: () => import('@/views/Suppliers/MaterialCode/MaterialCode'),
      //   meta: {
      //     title: '计划执行待执行',
      //     keepAlive: true,
      //     hidden: true,
      //     permission: ['MerchantsPurchaseManagMaterialCode']
      //   }
      // },
      {
        path: '/plan-manage/purchase-manage/match-contract',
        name: 'MerchantsPurchaseManagMatchContract',
        hidden: true,
        component: () => import('@/views/Suppliers/matchContract/index'),
        meta: {
          title: '手动匹配合同',
          keepAlive: true,
          permission: ['MerchantsPurchaseManage']
        }
      }

      // // 计划审批暂时不上无需删除
      // {
      //   path: '/authention-message/approval',
      //   name: 'authention-message-approval',
      //   hidden: true,
      //   component: () => import('@/views/Suppliers/authention/planApproval/approval'),
      //   meta: { title: '计划审批', keepAlive: true, hidden: true, permission: ['CertDetail'] }
      // },

      // {
      //   path: '/authention-message/allocated',
      //   name: 'authention-message-allocated',
      //   hidden: true,
      //   component: () => import('@/views/Suppliers/authention/istributions/allocated'),
      //   meta: { title: '采购计划拟分配', keepAlive: true, hidden: true, permission: ['CertDetail'] }
      // }
    ]
  }
]
