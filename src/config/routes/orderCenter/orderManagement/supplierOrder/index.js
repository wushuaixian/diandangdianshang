/*
 * @Author: your name
 * @Date: 2021-07-16 17:19:23
 * @LastEditTime: 2021-08-03 10:10:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/orderCenter/orderManagement/supplierOrder/index.js
 */
export default [{
    path: '/orderManagement/supplierOrder/orderList',
    name: 'SupplierOrderOrderList',
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/orderList.vue'),
    meta: {
      title: '订单列表',
      keepAlive: true,
      permission: ['SupplierOrderOrderList']
    }
  },
  {
    path: '/orderManagement/supplierOrder/orderDetail/:id',
    name: 'SupplierOrderOrderDetail',
    hidden: true,
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/orderDetail.vue'),
    meta: { title: '点选订单详情', keepAlive: true, permission: ['SupplierOrderOrderList'] }
  },
  {
    path: '/orderManagement/supplierOrder/orderDetailSourcing',
    name: 'SupplierOrderOrderDetailSourcing',
    hidden: true,
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/orderDetailSourcing.vue'),
    meta: { title: '寻源订单详情', keepAlive: true, permission: ['SupplierOrderOrderList'] }
  },
  {
    path: '/orderManagement/supplierOrder/orderApprovalList',
    name: 'SupplierOrderOrderApprovalList',
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/orderApprovalList.vue'),
    meta: {
      title: '订单审核列表',
      keepAlive: true,
      permission: ['SupplierOrderOrderApprovalList']
    }
  }
]
