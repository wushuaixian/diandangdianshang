/*
 * @Author: your name
 * @Date: 2021-08-01 15:32:17
 * @LastEditTime: 2021-08-08 14:29:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/approvalProcess.js
 */
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/configgurationCenter/approval-process',
    name: 'ApprovalProcessManage',
    component: RouteView,
    meta: { title: '审批流', keepAlive: true, icon: bxAnaalyse, permission: ['ApprovalProcessManage'] },
    children: [
      {
        path: '/configgurationCenter/approval-process/afProcess/list',
        name: 'ApprovalProcessAfProcessList',
        component: () => import('@/views/configgurationCenter/approvalProcess/afProcess/list'),
        meta: { title: '审批流管理', keepAlive: true, permission: ['ApprovalProcessAfProcessList'] }
      },
      {
        path: '/configgurationCenter/approval-process/afProcess/edit/:id',
        name: 'ApprovalProcessAfProcessEdit',
        hidden: true,
        component: () => import('@/views/configgurationCenter/approvalProcess/afProcess/edit'),
        meta: { title: '审批流管理编辑', keepAlive: true, permission: ['ApprovalProcessAfProcessList'] }
      },
      {
        path: '/configgurationCenter/approval-process/afProcess/detail/:id',
        name: 'ApprovalProcessAfProcessDetail',
        hidden: true,
        component: () => import('@/views/configgurationCenter/approvalProcess/afProcess/detail'),
        meta: { title: '审批流管理详情', keepAlive: true, permission: ['ApprovalProcessAfProcessList'] }
      },
      {
        path: '/configgurationCenter/approval-process/afTask/list',
        name: 'ApprovalProcessAfTakList',
        component: () => import('@/views/configgurationCenter/approvalProcess/afTask/list'),
        meta: { title: '审批流任务管理', keepAlive: true, permission: ['ApprovalProcessAfTakList'] }
      },
      {
        path: '/configgurationCenter/approval-process/afTask/detail/:taskCode/:auditTaskId',
        name: 'ApprovalProcessAfTakDetail',
        hidden: true,
        component: () => import('@/views/configgurationCenter/approvalProcess/afTask/detail'),
        meta: { title: '审批流任务管理详情', keepAlive: true, permission: ['ApprovalProcessAfTakList'] }
      }
    ]
  }
]
