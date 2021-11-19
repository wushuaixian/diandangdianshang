/*
 * @Author: your name
 * @Date: 2021-06-19 13:03:03
 * @LastEditTime: 2021-06-26 17:58:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/allocationOfTenderSet.js
 */
export default [
  {
    path: '/allocationOfTenderSet/index',
    name: 'AllocationOfTenderSetIndex',
    component: () => import('@/views/configgurationCenter/allocationOfTenderSet'),
    meta: { title: '标书费设置', keepAlive: true, permission: ['AllocationOfTenderSet'] }
  },
  {
    path: '/allocationOfTenderSet/setAllocationOfTender',
    name: 'SetAllocationOfTender',
    hidden: true,
    component: () => import('@/views/configgurationCenter/allocationOfTenderSet/setAllocationOfTender'),
    meta: { title: '新增采购商标书设置', keepAlive: true, permission: ['AllocationOfTenderSet'] }
  },
  {
    path: '/allocationOfTenderSet/updataAllocationOfTender/:id/:price',
    name: 'UpdataAllocationOfTender',
    hidden: true,
    component: () => import('@/views/configgurationCenter/allocationOfTenderSet/updataAllocationOfTender'),
    meta: { title: '修改采购商标书设置', keepAlive: true, permission: ['AllocationOfTenderSet'] }
  }
]
