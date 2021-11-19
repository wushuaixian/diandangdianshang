/*
 * @Author: your name
 * @Date: 2021-08-01 20:08:03
 * @LastEditTime: 2021-08-04 11:39:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/orderCenter/orderManagement/systemOrder/index.js
 */
export default [
  {
    path: '/orderManagement/SysOrder/orderList',
    name: 'SysOrderOrderList',
    component: () => import('@/views/orderCenter/orderManagement/systemOrder/orderList'),
    meta: { title: '订单列表', keepAlive: true, permission: ['SysOrderOrderList'] }
  },
  {
    path: '/orderManagement/SysOrder/orderListDetails',
    name: 'SysOrderOrderListDetails',
    hidden: true,
    component: () => import('@/views/orderCenter/orderManagement/systemOrder/detailsmaster'),
    meta: { title: '订单列表详情', keepAlive: true, permission: ['SysOrderOrderList'] }
  }
]
