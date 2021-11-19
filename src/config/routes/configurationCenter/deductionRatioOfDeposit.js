/*
 * @Author: your name
 * @Date: 2021-06-19 13:01:31
 * @LastEditTime: 2021-06-24 18:55:14
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/configurationCenter/deductionRatioOfDeposit.js
 */
export default [
  {
    path: '/deductionRatioOfDeposit',
    name: 'DeductionRatioOfDepositIndex',
    component: () => import('@/views/configgurationCenter/deductionRatioOfDeposit'),
    meta: { title: '保证金罚扣比例', keepAlive: true, permission: ['DeductionRatioOfDeposit'] }
  }
]
