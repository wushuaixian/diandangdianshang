/*
 * @Author: Yang Jian
 * @Date: 2021-06-18 16:50:57
 * @LastEditTime: 2021-06-23 19:03:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/index.js
 */
import deductionRatioOfDeposit from './deductionRatioOfDeposit' // 财务设置
import allocationOfTenderSet from './allocationOfTenderSet' // 标书费配置
import marginSetting from './marginSetting' // 保证金设置
import operatedConfigure from './operatedConfigure/operatedConfigure'
import basicConfiguration from './basicConfiguration'
import approvalProcess from './approvalProcess'
import { bxAnaalyse } from '@/core/icons'

import commodityConfigure from './commodityConfigure/auditPlatform/auditCategory'

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/configgurationCenter',
    name: 'ConfiggurationCenter',
    component: RouteView,
    meta: { title: '配置中心', keepAlive: true, icon: bxAnaalyse, permission: ['ConfiggurationCenter'] },
    children: [
      // 基础配置路由权限没加，如添加请删除此标注
      {
        path: '/basicConfiguration',
        name: 'basicConfiguration',
        component: RouteView,
        meta: { title: '基础配置', keepAlive: true, icon: bxAnaalyse, permission: ['MarginSetting'] },
        children: [...basicConfiguration]
      },
      {
        path: '/marginSetting',
        name: 'MarginSetting',
        component: RouteView,
        meta: { title: '保证金设置', keepAlive: true, icon: bxAnaalyse, permission: ['MarginSetting'] },
        children: [...marginSetting]
      },
      {
        path: '/allocationOfTenderSet',
        name: 'AllocationOfTenderSet',
        component: RouteView,
        meta: { title: '标书费设置', keepAlive: true, icon: bxAnaalyse, permission: ['AllocationOfTenderSet'] },
        children: [...allocationOfTenderSet]
      },
      {
        path: '/deductionRatioOfDeposit',
        name: 'DeductionRatioOfDeposit',
        component: RouteView,
        meta: { title: '财务配置', keepAlive: true, icon: bxAnaalyse, permission: ['DeductionRatioOfDeposit'] },
        children: [...deductionRatioOfDeposit]
      },
      {
        path: '/operatedConfigure',
        name: 'OperatedConfigure',
        component: RouteView,
        meta: { title: '运营参数配置', keepAlive: true, icon: bxAnaalyse, permission: ['OperatedConfigure'] },
        children: [...operatedConfigure]
      },
      {
        path: '/goodsConfigure',
        name: 'GoodsConfigure',
        component: RouteView,
        meta: { title: '商品配置', keepAlive: true, icon: bxAnaalyse, permission: ['Workplace'] },
        children: [...commodityConfigure]
      },
      ...approvalProcess
    ]
  }
]
