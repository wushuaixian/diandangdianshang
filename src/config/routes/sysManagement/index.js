/*
 * @Author: your name
 * @Date: 2021-07-15 16:30:53
 * @LastEditTime: 2021-08-04 17:37:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/sysManagement/index.js
 */
import vr from './vr'
import appealManageRoute from './appeal'
import suppliersManageRoute from './suppliers'
import purchasersManageRoute from './purchasers'
import finance from './finance'
import plan from './plan'
import contract from '../contract/contract.js'
import product from '../product/index.js' // 商品中心
import { bxAnaalyse } from '@/core/icons'
import message from './message'

export default [
  ...vr,
  ...suppliersManageRoute,
  ...purchasersManageRoute,
  ...appealManageRoute,
  ...plan,
  {
    path: '/xuanyuanguanli',
    name: 'xuanyuanguanli',
    meta: { title: '寻源管理', target: true, icon: bxAnaalyse, permission: ['xuanyuanguanli'] }
  },
  ...contract,
  ...product,
  ...finance,
  ...message
]
