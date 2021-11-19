/*
 * @Author: your name
 * @Date: 2021-07-15 17:48:59
 * @LastEditTime: 2021-08-04 17:38:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/merchants/index.js
 */
// 供应商
import authentionRoute from './authention'
import packageRoute from './package'
import planManageRoute from './planManage/'
import financeRoute from './finance'
import contractRoute from './contract'
import configuration from './configuration'
import { bxAnaalyse } from '@/core/icons'
// import userManageRoute from './userManage'
export default [
  ...planManageRoute,
  {
    path: '/xuanyuanguanli',
    name: 'xuanyuanguanli',
    meta: { title: '寻源管理', target: true, icon: bxAnaalyse, permission: ['xuanyuanguanli'] }
  },
  ...contractRoute,
  ...authentionRoute, // 认证管理
  ...packageRoute, // vip套餐
  ...financeRoute, //  财务中心
  ...configuration // 配置中心
]
