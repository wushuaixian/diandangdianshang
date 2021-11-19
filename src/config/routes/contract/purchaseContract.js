/*
 * @Author: your name
 * @Date: 2021-08-03 11:47:11
 * @LastEditTime: 2021-08-04 18:00:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/routes/contract/purchaseContract.js
 */

const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/contract/contractsSigned',
    name: 'ContractContractsSigned',
    component: () => import('@/views/contract/purchasers/contractsSigned/contractsSigned.vue'),
    meta: { title: '采购待签合同列表', keepAlive: true, permission: ['ContractContractsSigned'] }
  },
  {
    path: '/contract/detailedList',
    name: 'ContractdetailedList',
    hidden: true,
    component: () => import('@/views/contract/purchasers/contractsSigned/detailedList.vue'),
    meta: { title: '详情列表', keepAlive: true, permission: ['ContractContractsSigned'] }
  },
  {
    path: '/contract/purchase/template',
    name: 'ContractPurchaseTemplate',
    component: RouteView,
    meta: { title: '采购合同模板管理', keepAlive: false, permission: ['ContractPurchaseTemplate'] },
    children: [
      {
        path: '/contract/purchase/template',
        name: 'ContractPurchaseTemplateList',
        component: () => import('@/views/contract/purchasers/template.vue'),
        meta: { title: '采购合同模板', keepAlive: true, permission: ['ContractPurchaseTemplateList'] }
      },
      {
        path: '/contract/purchase/addtemplate',
        name: 'CreatContractPurchaseAddtemplate',
        component: () => import('@/views/contract/purchasers/addTemplate/index.vue'),
        meta: { title: '添加合同模板', keepAlive: false, permission: ['ContractPurchaseTemplateList'] }
      },
      {
        path: '/contract/purchase/edittemplate',
        name: 'ContractPurchaseAddtemplate',
        component: () => import('@/views/contract/purchasers/editTemplate.vue'),
        hidden: true,
        meta: { title: '编辑合同模板', keepAlive: false, permission: ['ContractPurchaseTemplateList'] }
      }
    ]
  },
  {
    path: '/contract/purchase/contract',
    name: 'ContractPurchaseManage',
    component: RouteView,
    meta: { title: '采购合同管理', keepAlive: false, permission: ['ContractPurchaseManage'] },
    children: [
      {
        path: '/contract/purchase/contractList',
        name: 'ContractPurchaseContractList',
        component: () => import('@/views/contract/purchasers/contractList'),
        meta: { title: '采购合同列表', keepAlive: true, permission: ['ContractPurchaseContractList'] }
      },
      {
        path: '/contract/purchase/addcontract',
        name: 'CreatContractPurchaseAddcontract',
        component: () => import('@/views/contract/purchasers/addContract'),
        meta: { title: '添加采购合同', keepAlive: false, permission: ['ContractPurchaseContractList'] }
      },
      {
        path: '/contract/purchase/editcontract',
        name: 'ContractPurchaseAddcontract',
        component: () => import('@/views/contract/purchasers/editContract'),
        hidden: true,
        meta: { title: '编辑采购合同', keepAlive: false, permission: ['ContractPurchaseContractList'] }
      },
      {
        path: '/contract/purchase/pendingApproval',
        name: 'ContractPurchasePendingApproval',
        component: () => import('@/views/contract/purchasers/pendingApproval/pendingApproval.vue'),
        meta: { title: '采购合同审批', keepAlive: true, permission: ['ContractPurchasePendingApproval'] }
      }
    ]
  }
]
