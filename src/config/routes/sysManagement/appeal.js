/*
 * @Author: your name
 * @Date: 2021-06-24 01:30:10
 * @LastEditTime: 2021-08-04 19:31:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/sysManagement/appeal.js
 */
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/appeal-manage',
    name: 'AppealManage',
    meta: { title: '申诉管理', icon: 'user', keepAlive: true, permission: ['AppealManage'] },
    component: RouteView,
    children: [
      {
        path: '/appeal-manage/list',
        name: 'AppealManageList',
        component: () => import('@/views/sysManagement/appealManage/list'),
        meta: { title: '工商信息申诉', keepAlive: true, permission: ['AppealManageList'] }
      },
      {
        path: '/appeal-manage/detail/:id',
        hidden: true,
        name: 'AppealManageDetail',
        component: () => import('@/views/sysManagement/appealManage/detail'),
        meta: { title: '申诉详情', keepAlive: true, permission: ['AppealManageList'] }
      }
    ]
  }
]
