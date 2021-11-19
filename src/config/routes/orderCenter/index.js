/*
 * @Author: your name
 * @Date: 2021-07-16 16:54:36
 * @LastEditTime: 2021-08-13 13:46:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/orderCenter/index.js
 */
import { bxAnaalyse } from '@/core/icons'
import orderManagement from './orderManagement/index'
import systemOrder from './orderManagement/systemOrder/index'
import buyerOrder from './orderManagement/buyerOrder/index' // 采购商
import operateOrder from './orderManagement/operateOrder/index' // 运营
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/OrderCenter',
    name: 'OrderCenter',
    meta: { title: '订单中心', icon: bxAnaalyse, keepAlive: true, permission: ['OrderCenter'] },
    component: RouteView,
    children: [
      ...orderManagement
    ]
  },
  {
    path: '/SysOrderCenter',
    name: 'SysOrderCenter',
    meta: { title: '订单管理', icon: bxAnaalyse, keepAlive: true, permission: ['SysOrderCenter'] },
    component: RouteView,
    children: [
      ...systemOrder,
      ...operateOrder
    ]
  },
  {
    path: '/BuyerOrderManage',
    name: 'BuyerOrderManage',
    meta: { title: '采购管理', icon: bxAnaalyse, keepAlive: true, permission: ['BuyerOrderManage'] },
    component: RouteView,
    children: [
      {
        path: '/BuyerOrder',
        name: 'BuyerOrder',
        meta: { title: '采购单', icon: bxAnaalyse, keepAlive: true, permission: ['BuyerOrder'] },
        component: RouteView,
        children: [
          ...buyerOrder
        ]
      },
      {
        path: '/paymentMethodSettings',
        name: 'PaymentMethodSettings',
        component: () => import('@/views/orderCenter/orderManagement/buyerOrder/paymentMethodSettings/index.vue'),
        meta: { title: '付款方式设置', keepAlive: true, permission: ['PaymentMethodSettings'] }
      },
      {
        path: '/paymentMethodSettingsDetail',
        name: 'PaymentMethodSettingsDetail',
        component: () => import('@/views/orderCenter/orderManagement/buyerOrder/paymentMethodSettings/detail.vue'),
        hidden: true,
        meta: { title: '付款方式设置详情', keepAlive: true, permission: ['PaymentMethodSettings'] }
      }
    ]
  }

]
