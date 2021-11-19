/*
 * @Author: your name
 * @Date: 2021-07-20 20:58:53
 * @LastEditTime: 2021-08-04 10:32:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/basicConfiguration.js
 */
export default [
  {
    path: '/basicConfiguration/menuPathConfiguration',
    name: 'MenuPathConfiguration',
    component: () => import('@/views/configgurationCenter/menuPathConfiguration/index'),
    meta: { title: '菜单路径配置', keepAlive: true, permission: ['MenuPathConfiguration'] }
  },
  {
    path: '/basicConfiguration/dataDictionary',
    name: 'BasicConfigurationDataDictionary',
    component: () => import('@/views/configgurationCenter/basicConfiguration/dataDictionary/'),
    meta: { title: '数据字典', keepAlive: true, permission: ['BasicConfigurationDataDictionary'] }
  },
  {
    path: '/basicConfiguration/basicService',
    name: 'BasicServiceList',
    component: () => import('@/views/configgurationCenter/basicService/basicServiceList/index'),
    meta: { title: '采购商基础服务配置', keepAlive: true, permission: ['BasicServiceList'] }
  },
  {
    path: '/basicConfiguration/basicServiceList/:type/:id',
    name: 'BasicServiceSet',
    hidden: true,
    component: () => import('@/views/configgurationCenter/basicService/addBasicService/index'),
    meta: { title: '新增编辑采购商基础服务配置', keepAlive: true, permission: ['BasicServiceList'] }
  }
]
