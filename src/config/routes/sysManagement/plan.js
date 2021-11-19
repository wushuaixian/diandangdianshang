/*
 * @Author: your name
 * @Date: 2021-07-23 10:29:46
 * @LastEditTime: 2021-08-03 15:58:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/sysManagement/plan.js
 */
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/sys-plan-manage',
    name: 'SysPlanManage',
    meta: { title: '计划管理', icon: bxAnaalyse, keepAlive: true, permission: ['SysPlanManage'] },
    component: RouteView,
    children: [
      {
        path: '/sys-plan-manage/matter-manage',
        name: 'SysPlanManageMatterManage',
        meta: { title: '物料管理', icon: bxAnaalyse, keepAlive: true, permission: ['SysPlanManageMatterManage'] },
        component: RouteView,
        children: [
          {
            path: '/sys-plan-manage/matter-manage/detailed',
            name: 'SysPlanManageMatterManageDetailed',
            component: () => import('@/views/Suppliers/planManage/projectCarry/sysMaterialDetailed'),
            meta: {
              title: '物料明细',
              keepAlive: true,
              hidden: true,
              permission: ['SysPlanManageMatterManageDetailed']
            }
          },
          {
            path: '/sys-plan-manage/matter-manage/category',
            name: 'SysPlanManageMatterManageCategory',
            component: () => import('@/views/Suppliers/Materials/sysMaterials'),
            meta: {
              title: '物料类目',
              keepAlive: true,
              hidden: true,
              permission: ['SysPlanManageMatterManageCategory']
            }
          }
        ]
      }
    ]
  }
]
