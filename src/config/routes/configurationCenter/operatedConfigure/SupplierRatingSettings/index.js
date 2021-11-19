/*
 * @Author: your name
 * @Date: 2021-08-01 15:32:17
 * @LastEditTime: 2021-08-04 19:48:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/operatedConfigure/SupplierRatingSettings/index.js
 */
// import GradeSettings from './GradeSettings'
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/SupplierRatingSetting',
    name: 'SupplierRatingSetting',
    component: RouteView,
    meta: { title: '供应商评级设置', icon: bxAnaalyse, permission: ['SupplierRatingSetting'] },
    children: [
      {
        path: '/SupplierRatingSetting/SupplierGradeSettings',
        name: 'SupplierGradeSettings',
        component: () => import('@/views/SupplierRatingSetting/SupplierGradeSettings'),
        meta: { title: '供应商等级设置', keepAlive: true, permission: ['SupplierGradeSettings'] }
      },
      {
        path: '/SupplierRatingSetting/SupplierGradeProportionProgramme',
        name: 'SupplierGradeProportionProgramme',
        component: () => import('@/views/SupplierRatingSetting/SupplierGradeProportionProgramme'),
        meta: { title: '供应商等级方案占比', keepAlive: true, permission: ['SupplierGradeProportionProgramme'] }
      },
      {
        path: '/SupplierRatingSetting/SupplierScoringScheme',
        name: 'SupplierScoringScheme',
        component: () => import('@/views/SupplierRatingSetting/SupplierScoringScheme'),
        meta: { title: '供应商评分方案', keepAlive: true, permission: ['SupplierScoringScheme'] }
      },
      {
        path: '/SupplierRatingSetting/CategoryValueProportionSetting',
        name: 'CategoryValueProportionSetting',
        component: () => import('@/views/SupplierRatingSetting/CategoryValueProportionSetting'),
        meta: { title: '类目分值比例设置', keepAlive: true, permission: ['CategoryValueProportionSetting'] }
      },
      {
        path: '/SupplierRatingSetting/formlist/:value/:id/:nub',
        name: 'formlist',
        component: () => import('@/views/SupplierRatingSetting/componentForm/formlist'),
        meta: { title: '添加方案', keepAlive: true, permission: ['SupplierRatingSetting'] },
        hidden: true
      },
      {
        // /:value/:formSelect/:id/:nub
        path: '/SupplierRatingSetting/formSupplierScoringScheme',
        name: 'foformSupplierScoringSchemermlist',
        component: () => import('@/views/SupplierRatingSetting/componentForm/formSupplierScoringScheme'),
        meta: { title: '添加方案', keepAlive: true, permission: ['SupplierRatingSetting'] },
        hidden: true
      },
      {
        path: '/SupplierRatingSetting/formCategoryValueProportionSetting/:add/:id',
        name: 'formCategoryValueProportionSetting',
        component: () => import('@/views/SupplierRatingSetting/componentForm/formCategoryValueProportionSetting.vue'),
        meta: { title: '类目分值比例设置', keepAlive: true, permission: ['SupplierRatingSetting'] },
        hidden: true
      }
    ]
  }
]
