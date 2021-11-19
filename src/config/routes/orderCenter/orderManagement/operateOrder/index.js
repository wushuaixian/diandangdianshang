/*
 * @Author: your name
 * @Date: 2021-07-26 10:29:29
 * @LastEditTime: 2021-08-13 12:02:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/orderCenter/orderManagement/operateOrder/index.js
 */
export default [
  {
    path: '/orderManagement/supplierOrder/distributionList',
    name: 'SupplierOrderDistributionList',
    component: () => import('@/views/orderCenter/orderManagement/operateOrder/distributionList.vue'),
    meta: { title: '配送公司列表', keepAlive: true, permission: ['SupplierOrderDistributionList'] }
  }
]
