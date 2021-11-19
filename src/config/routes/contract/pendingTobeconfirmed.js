/*
 * @Author: your name
 * @Date: 2021-07-13 16:24:55
 * @LastEditTime: 2021-08-04 16:43:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/contract/pendingTobeconfirmed.js
 */
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/contract/pendingTobeconfirmed1',
    name: 'PendingTobeconfirmed',
    component: RouteView,
    meta: { title: '销售合同管理', keepAlive: true, permission: ['PendingTobeconfirmed'] },
    children: [
      {
        path: '/contract/pendingTobeconfirmed',
        name: 'ContractPendingTobeconfirmed',
        component: () => import('@/views/contract/suppliers/pendingTobeconfirmed/pendingTobeconfirmed.vue'),
        meta: { title: '销售合同确认', keepAlive: true, permission: ['ContractPendingTobeconfirmed'] }
      },
      {
        path: '/contract/pendingTobeconfirmed/showcontract',
        name: 'ContractSuppliersShowContract',
        component: () => import('@/views/contract/purchasers/editContract'),
        hidden: true,
        meta: { title: '查看采购合同', keepAlive: false, permission: ['ContractPendingTobeconfirmed'] }
      }
    ]
  }
]
