/*
 * @Author: your name
 * @Date: 2021-06-19 13:11:24
 * @LastEditTime: 2021-07-29 11:18:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/marginSetting.js
 */
export default [
  {
    path: '/marginSetting/platformMargin',
    name: 'PlatformMargin',
    component: () => import('@/views/configgurationCenter/marginSetting/platformMargin'),
    meta: { title: '平台保证金', keepAlive: true, permission: ['MarginSetting'] }
  },
  // 先注释功能后续再开启
  // {
  //   path: '/marginSetting/marginForSourcing',
  //   name: 'MarginForSourcing',
  //   component: () => import('@/views/configgurationCenter/marginSetting/marginForSourcing'),
  //   meta: { title: '采购商寻源保证金', keepAlive: true, permission: ['MarginSetting'] }
  // },
  {
    path: '/marginSetting/setPlatformMargin',
    name: 'SetPlatformMargin',
    hidden: true,
    component: () => import('@/views/configgurationCenter/marginSetting/setPlatformMargin'),
    meta: { title: '新增采购商寻源保证金', keepAlive: true, permission: ['MarginSetting'] }
  },
  {
    path: '/marginSetting/updataPlatformMargin/:id/:price',
    name: 'UpdataPlatformMargin',
    hidden: true,
    component: () => import('@/views/configgurationCenter/marginSetting/updataPlatformMargin'),
    meta: { title: '修改采购商寻源保证金', keepAlive: true, permission: ['MarginSetting'] }
  },
  {
    path: '/marginSetting/supplierMargin',
    name: 'SupplierMargin',
    component: () => import('@/views/configgurationCenter/marginSetting/supplierMargin'),
    meta: { title: '供应商寻源保证金', keepAlive: true, permission: ['MarginSetting'] }
  },
  {
    path: '/marginSetting/supplierStoreDeposit',
    name: 'SupplierStoreDeposit',
    component: () => import('@/views/configgurationCenter/marginSetting/supplierStoreDeposit'),
    meta: { title: '供应商店铺保证金', keepAlive: true, permission: ['MarginSetting'] }
  },
  {
    path: '/marginSetting/daysDepositRefund',
    name: 'DaysDepositRefund',
    component: () => import('@/views/configgurationCenter/marginSetting/daysDepositRefund'),
    meta: { title: '保证金退还天数', keepAlive: true, permission: ['MarginSetting'] }
  },
  {
    path: '/marginSetting/buyerSecurityDeposit/index',
    name: 'BuyerSecurityDeposit',
    component: () => import('@/views/configgurationCenter/marginSetting/buyerSecurityDeposit/index'),
    meta: { title: '采购商免保证金', keepAlive: true, permission: ['MarginSetting'] }
  },
  {
    path: '/marginSetting/buyerSecurityDeposit/add',
    name: 'BuyerSecurityDepositAdd',
    hidden: true,
    component: () => import('@/views/configgurationCenter/marginSetting/buyerSecurityDeposit/add'),
    meta: { title: '采购商免保证金-新增', keepAlive: true, permission: ['MarginSetting'] }
  }
]
