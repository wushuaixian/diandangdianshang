// 物料管理
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/plan-manage/matter-manage',
    name: 'MerchantsMatterManage',
    component: RouteView,
    meta: { title: '物料管理', keepAlive: true, icon: bxAnaalyse, permission: ['MerchantsMatterManage'] },
    children: [
      {
        path: '/plan-manage/matter-manage/detailed',
        name: 'MerchantsMatterManageDetailed',
        component: () => import('@/views/Suppliers/planManage/projectCarry/materialDetailed'),
        meta: { title: '物料明细', keepAlive: true, permission: ['MerchantsMatterManageDetailed'] }
      },
      {
        path: '/plan-manage/matter-manage/category',
        name: 'MerchantsMatterManageCategory',
        component: () => import('@/views/Suppliers/Materials/Materials'),
        meta: {
          title: '物料类目',
          keepAlive: true,
          permission: ['MerchantsMatterManageCategory']
        }
      },
      {
        path: '/plan-manage/matter-manage/configure',
        name: 'MerchantsMatterManageConfigure',
        component: () => import('@/views/Suppliers/planManage/istributions/toConfigure'),
        meta: {
          title: '配置采购员',
          keepAlive: true,
          permission: ['MerchantsMatterManageConfigure']
        }
      },
      {
        path: '/plan-mansage/matter-manage/configure-results',
        name: 'MerchantsMatterManageConfigureResults',
        component: () => import('@/views/Suppliers/planManage/purchaserConfigurationResults'),
        meta: {
          title: '采购员配置结果',
          keepAlive: true,
          permission: ['MerchantsMatterManageConfigureResults']
        }
      }
    ]
  }
]
