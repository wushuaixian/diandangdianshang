/*
 * @Author: your name
 * @Date: 2021-06-28 23:47:01
 * @LastEditTime: 2021-08-07 17:29:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/systemManagement/index.js
 */
import { bxAnaalyse } from '@/core/icons'
const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/system-management',
    name: 'systemManagement',
    meta: { title: '系统管理', icon: bxAnaalyse, keepAlive: true, permission: ['systemManagement'] },
    component: RouteView,
    children: [
      {
        path: 'role-management/list',
        name: 'RoleManagementList',
        component: () => import('@/views/systemManagement/roleManagement/list/index.vue'),
        meta: { title: '角色管理', permission: ['RoleManagementList'] }
      },
      {
        path: '/role-management/create',
        name: 'RoleManagementCreate',
        component: () => import('@/views/systemManagement/roleManagement/create/index.vue'),
        meta: { title: '新增角色', permission: ['PurchaseList'] },
        hidden: true
      },
      {
        path: 'post-management/list',
        name: 'PostManagement',
        component: () => import('@/views/systemManagement/postManagement/list/index.vue'),
        meta: { title: '岗位管理', permission: ['PostManagement'] }
      },
      {
        path: 'staff-management/list',
        name: 'StaffManagement',
        component: () => import('@/views/systemManagement/staffManagement/list/index.vue'),
        meta: { title: '员工管理', permission: ['StaffManagement'] }
      },
      {
        path: '/staff-management/create',
        name: 'StaffManagementCreate',
        component: () => import('@/views/systemManagement/staffManagement/create/index.vue'),
        meta: { title: '新增员工', permission: ['StaffManagement'] },
        hidden: true
      },
      {
        path: '/staff-management/detail/:id',
        name: 'StaffManagementCreateDetail',
        component: () => import('@/views/systemManagement/staffManagement/edit/index.vue'),
        meta: { title: '编辑员工', permission: ['StaffManagement'] },
        hidden: true
      },
      {
        path: '/staff-management/authority/:id',
        name: 'StaffAuthority',
        component: () => import('@/views/systemManagement/staffManagement/authority/index.vue'),
        meta: { title: '功能权限', permission: ['StaffManagement'] },
        hidden: true
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/systemManagement/organization/list/index'),
        meta: {
          title: '组织架构',
          keepAlive: true,
          permission: ['Organization']
        }
      },
      {
        path: 'organization/detail/:id/:edit/:departmentType',
        name: 'OrganizationDetail',
        component: () => import('@/views/systemManagement/organization/list/detail'),
        hidden: true,
        meta: {
          title: '组织架构管理',
          keepAlive: true,
          permission: ['Organization']
        }
      },
      {
        path: '/userManagement',
        name: 'UserManage',
        keepAlive: true,
        component: () => import('@/views/userManagement/index'),
        meta: { title: '用户管理', keepAlive: true, permission: ['UserManage'] }
      },
      {
        path: '/logManagement',
        name: 'LogManagement',
        keepAlive: true,
        component: RouteView,
        meta: { title: '日志管理', keepAlive: true, permission: ['LogManagement'] },
        children: [
          {
            path: '/logManagement/loginManagement',
            name: 'LoginManagement',
            keepAlive: true,
            component: () => import('@/views/systemManagement/logManagement/loginManagement'),
            meta: { title: '登录日志', keepAlive: true, permission: ['LoginManagement'] }
          },
          {
            path: '/logManagement/operationLog',
            name: 'OperationLog',
            keepAlive: true,
            component: () => import('@/views/systemManagement/logManagement/operationLog'),
            meta: { title: '操作日志', keepAlive: true, permission: ['OperationLog'] }
          }
        ]
      },
      {
        path: '/personalCenter',
        name: 'PersonalCenter',
        keepAlive: true,
        component: RouteView,
        meta: { title: '个人中心', keepAlive: true, permission: ['PersonalCenter'] },
        children: [
          {
            path: '/logManagement/personalInformation',
            name: 'PersonalInformation',
            keepAlive: true,
            component: () => import('@/views/systemManagement/staffManagement/edit/index.vue'),
            meta: { title: '个人信息', keepAlive: true, permission: ['PersonalInformation'] }
          },
          {
            path: '/personalCenter/accountSecurity',
            name: 'AccountSecurity',
            keepAlive: true,
            component: () => import('@/views/systemManagement/personalCenter/accountSecurity'),
            meta: { title: '账户安全', keepAlive: true, permission: ['AccountSecurity'] }
          },
          {
            path: '/personalCenter/receivingAddress',
            name: 'ReceivingAddress',
            keepAlive: true,
            component: () => import('@/views/systemManagement/personalCenter/receivingAddress'),
            meta: { title: '收货地址', keepAlive: true, permission: ['ReceivingAddress'] }
          }
        ]
      },
      {
        path: '/rejectLibrary',
        name: 'RejectLibrary',
        component: () => import('@/views/systemManagement/rejectLibrary/index.vue'),
        meta: { title: '话术库', permission: ['RejectLibrary'] }
      }
    ]
  }
]
