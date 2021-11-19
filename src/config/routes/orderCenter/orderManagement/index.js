/*
 * @Author: your name
 * @Date: 2021-07-16 16:57:31
 * @LastEditTime: 2021-07-29 14:39:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/orderCenter/orderManagement/index.js
 */
import supplierOrder from './supplierOrder/index' // 供应商
import operateOrder from './operateOrder/index' // 运营
import orderSystemManagement from './supplierOrder/orderSystemManagement'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/orderManagement',
    name: 'OrderManagement',
    component: RouteView,
    meta: { title: '订单管理', keepAlive: true, permission: ['OrderManagement'] },
    children: [
      ...supplierOrder, // 供应商
      ...operateOrder // 运营
    ]
  },
  {
    path: '/orderSystemManagement',
    name: 'OrderSystemManagement',
    component: RouteView,
    meta: { title: '订单系统设置', keepAlive: true, permission: ['OrderSystemManagement'] },
    children: [
      ...orderSystemManagement
    ]
  }
]
