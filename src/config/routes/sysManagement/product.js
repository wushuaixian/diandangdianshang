/*
 * @Author: your name
 * @Date: 2021-06-17 13:43:07
 * @LastEditTime: 2021-08-03 16:47:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/sysManagement/product.js
 */
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/product',
    name: 'Product',
    component: RouteView,
    meta: { title: '商品中心', icon: 'user', permission: ['Product'] },
    children: [
      {
        path: 'mp',
        name: 'ProductMp',
        component: RouteView,
        meta: { title: '商品设置', permission: ['Product'] },
        children: [
          {
            path: 'category/list',
            name: 'ProductCategoryList',
            component: () => import('@/views/sysManagement/product/mp/category/list'),
            meta: { title: '类目设置', permission: ['ProductCategoryList'] }
          }
        ]
      }
    ]
  }
]
