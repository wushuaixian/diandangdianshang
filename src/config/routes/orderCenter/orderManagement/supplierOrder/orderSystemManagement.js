/*
 * @Author: your name
 * @Date: 2021-07-28 20:27:03
 * @LastEditTime: 2021-08-04 17:35:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/orderCenter/orderManagement/supplierOrder/orderSystemManagement.js
 */
export default [
   // 路由懒加载
   {
    path: '/orderManagement/supplierOrder/automatic',
    name: 'Automatic',
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/automatic.vue'),
    meta: {
      title: '自动接单配置',
      keepAlive: true,
      permission: ['Automatic']
    }
  },
  // 跳转
  {
    path: '/orderManagement/supplierOrder/components/listEdit',
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/listEdit.vue'),
    name: 'ListEdit',
    hidden: true,
    meta: {
      title: '接单配置详情',
      keepAlive: true,
      permission: ['Automatic']
    }
  },
  {
    path: '/orderManagement/supplierOrder/orderRuleSettings',
    name: 'OrderRuleSettings',
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/orderRuleSettings.vue'),
    meta: {
      title: '订单审核规则设置',
      keepAlive: true,
      permission: ['OrderRuleSettings']
    }
  },
  {
    path: '/orderManagement/supplierOrder/orderRuleSettingsDetail',
    name: 'OrderRuleSettingsDetail',
    hidden: true,
    component: () => import('@/views/orderCenter/orderManagement/supplierOrder/orderRuleSettingsDetail.vue'),
    meta: {
      title: '订单审核规则设置详情',
      keepAlive: true,
      permission: ['OrderRuleSettings']
    }
  }
]
