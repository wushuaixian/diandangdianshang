/*
 * @Author: your name
 * @Date: 2021-07-16 17:23:53
 * @LastEditTime: 2021-08-05 10:04:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/orderCenter/orderManagement/buyerOrder/index.js
 */
export default [
  {
    path: '/orderManagement/buyerOrder/orderList',
    name: 'orderManagementBuyerOrderList',
    component: () => import('@/views/orderCenter/orderManagement/buyerOrder/orderList/index'),
    meta: { title: '订单列表', keepAlive: true, permission: ['orderManagementBuyerOrderList'] }
  },
  {
    path: '/orderManagement/buyerOrder/addOrderIndex',
    name: 'orderManagementAddBuyerOrderIndex',
    component: () => import('@/views/orderCenter/orderManagement/buyerOrder/addOrder/index'),
    meta: { title: '添加订单', keepAlive: true, permission: ['orderManagementAddBuyerOrderIndex'] }
  },
  {
    path: '/orderManagement/buyerOrder/addOrder',
    name: 'orderManagementAddBuyerOrder',
    component: () => import('@/views/orderCenter/orderManagement/buyerOrder/addOrder/addOrder.vue'),
    hidden: true,
    meta: { title: '添加订单', keepAlive: true, permission: ['orderManagementAddBuyerOrderIndex'] }
  },
  {
    path: '/orderManagement/buyerOrder/orderDetail',
    name: 'orderManagementBuyerOrderDetail',
    component: () => import('@/views/orderCenter/orderManagement/buyerOrder/orderDetail/index.vue'),
    hidden: true,
    meta: { title: '订单详情', keepAlive: true, permission: ['orderManagementAddBuyerOrderIndex'] }
  }
]
