/*
 * @Author: your name
 * @Date: 2021-08-01 15:32:17
 * @LastEditTime: 2021-08-04 16:45:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/contract/suppliersContract.js
 */

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/contract/suppliers/template',
    name: 'ContractSuppliersTemplate',
    component: RouteView,
    meta: { title: '销售合同模板管理', keepAlive: true, permission: ['ContractSuppliersTemplate'] },
    children: [
      {
        path: '/contract/suppliers/template',
        name: 'ContractSuppliersTemplateList',
        component: () => import('@/views/contract/suppliers/template.vue'),
        meta: { title: '销售合同模板', keepAlive: true, permission: ['ContractSuppliersTemplateList'] }
      },
      {
        path: '/contract/suppliers/addtemplate',
        name: 'CreatContractSuppliersAddtemplate',
        component: () => import('@/views/contract/suppliers/addTemplate.vue'),
        meta: { title: '添加合同模板', keepAlive: true, permission: ['ContractSuppliersTemplateList'] }
      },
      {
        path: '/contract/suppliers/edittemplate',
        name: 'ContractSuppliersAddtemplate',
        component: () => import('@/views/contract/suppliers/editTemplate.vue'),
        hidden: true,
        meta: { title: '编辑合同模板', keepAlive: true, permission: ['ContractSuppliersTemplateList'] }
      }
    ]
  }
]
