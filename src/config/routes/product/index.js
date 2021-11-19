/*
 * @Author: your name
 * @Date: 2021-06-25 18:52:27
 * @LastEditTime: 2021-08-03 16:07:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/product/index.js
 */
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/product-center',
    name: 'ProductCenter',
    meta: { title: '商品中心', icon: bxAnaalyse, keepAlive: true, permission: ['ProductCenter'] },
    component: RouteView,
    children: [
      {
        path: 'product-set',
        name: 'ProductSet',
        component: RouteView,
        meta: { title: '商品设置', permission: ['ProductCenter'] },
        children: [
          // product-center/product-set/category/list
          {
            path: 'category/list',
            name: 'CategoryManagement',
            component: () => import('@/views/product/productSet/categoryManagement/index.vue'),
            meta: { title: '类目管理', permission: ['ProductCenter'] }
          },
          // /product-center/product-set/category/commodityCategoryVerificationQualification
          {
            path: 'category/commodityCategoryVerificationQualification',
            name: 'CommodityCategoryVerificationQualification',
            component: () => import('@/views/product/productSet/commodityCategoryVerificationQualification/index'),
            meta: { title: '商品类目校验资质', permission: ['ProductCenter'] }
          }
        ]
      }
    ]
  }
]
