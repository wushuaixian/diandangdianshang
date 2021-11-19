// import SupplierRating from './SupplierRating' // 供应商评级
// import SupplierRatingSettings from './SupplierRatingSettings' // 供应商等级设置
import SupplierRating from './SupplierRating' // 供应商评级
import SupplierRatingSettings from './SupplierRatingSettings' // 供应商等级设置
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/operatedConfigure/memberPackageSettings',
    name: 'memberPackageSettings',
    component: RouteView,
    meta: { title: '会员套餐设置', keepAlive: true, icon: bxAnaalyse, permission: ['memberPackageSettings'] },
    children: [
      {
        path: '/operatedConfigure/memberPackageSettings/leaguerPackageDetailedList/index',
        name: 'leaguerPackageDetailedListIndex',
        component: () =>
          import(
            '@/views/configgurationCenter/operatedConfigure/memberPackageSettings/leaguerPackageDetailedList/index'
          ),
        meta: { title: '会员套餐权益清单', permission: ['leaguerPackageDetailedListIndex'] }
      },
      {
        path: '/operatedConfigure/memberPackageSettings/leaguerPackageDetailedList/add-update',
        name: 'leaguerPackageDetailedListAddUpdate',
        component: () =>
          import(
            '@/views/configgurationCenter/operatedConfigure/memberPackageSettings/leaguerPackageDetailedList/add-update'
          ),
        hidden: true,
        meta: { title: '权益清单-添加/编辑', keepAlive: true, permission: ['leaguerPackageDetailedListIndex'] }
      },
      {
        path: '/operatedConfigure/memberPackageSettings/leaguerPackageManage/index',
        name: 'leaguerPackageManageIndexReview',
        component: () =>
          import('@/views/configgurationCenter/operatedConfigure/memberPackageSettings/leaguerPackageManage/index'),
        meta: { title: '会员套餐管理', permission: ['leaguerPackageManageIndexReview'] }
      },
      {
        path: '/operatedConfigure/memberPackageSettings/leaguerPackageManage/add-update',
        name: 'leaguerPackageManageAddUpdate',
        component: () =>
          import(
            '@/views/configgurationCenter/operatedConfigure/memberPackageSettings/leaguerPackageManage/add-update'
          ),
        hidden: true,
        meta: { title: '会员套餐管理-新增/编辑', keepAlive: true, permission: ['leaguerPackageManageIndexReview'] }
      },
      {
        path: '/operatedConfigure/memberPackageSettings/leaguerPackageDetail/index',
        name: 'leaguerPackageDetailIndexReview',
        component: () =>
          import('@/views/configgurationCenter/operatedConfigure/memberPackageSettings/leaguerPackageDetail/index'),
        meta: { title: '会员套餐关联明细', keepAlive: true, permission: ['leaguerPackageDetailIndexReview'] }
      },
      {
        path: '/operatedConfigure/memberPackageSettings/leaguerPackageDetail/add-update',
        name: 'LeaguerPackageDetailAddUpdate',
        component: () =>
          import(
            '@/views/configgurationCenter/operatedConfigure/memberPackageSettings/leaguerPackageDetail/add-update/add-update'
          ),
        hidden: true,
        meta: { title: '新增/编辑-会员套餐明细', keepAlive: true, permission: ['leaguerPackageDetailIndexReview'] }
      },

      {
        path: '/operatedConfigure/memberPackageSettings/leaguerPackageDetail/details',
        name: 'leaguerPackageDetail',
        component: () =>
          import('@/views/configgurationCenter/operatedConfigure/memberPackageSettings/leaguerPackageDetail/details'),
        hidden: true,
        meta: { title: '套餐详情', keepAlive: true, permission: ['leaguerPackageDetailIndexReview'] }
      }
    ]
  },
  {
    path: '/operatedConfigure/platformTerms',
    name: 'operatedConfigurePlatformTerms',
    component: RouteView,
    meta: { title: '平台条款', keepAlive: true, icon: bxAnaalyse, permission: ['operatedConfigurePlatformTerms'] },
    children: [
      {
        path: '/operatedConfigure/platformTerms/agreement',
        name: 'operatedConfigurePlatformTermsAgreementIndex',
        component: () => import(`@/views/configgurationCenter/operatedConfigure/platformTerms/agreement/index`),
        meta: { title: '条款协议', keepAlive: true, permission: ['operatedConfigurePlatformTermsAgreementIndex'] }
      },
      {
        path: '/operatedConfigure/platformTerms/template',
        name: 'operatedConfigurePlatformTermsTemplateReview',
        component: () => import(`@/views/configgurationCenter/operatedConfigure/platformTerms/template/index`),
        meta: { title: '模板管理', keepAlive: true, permission: ['operatedConfigurePlatformTermsTemplateReview'] }
      }
    ]
  },
  ...SupplierRating,
  ...SupplierRatingSettings
]
