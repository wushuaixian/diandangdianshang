const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default [
  {
    path: '/finance-manage',
    name: 'financeManagement',
    component: RouteView,
    meta: { title: '财务中心', icon: 'user', keepAlive: true, permission: ['financeManagement'] },
    children: [
      {
        path: '/finance-manage/finance-home',
        name: 'FinanceHome',
        meta: { title: '叮当账户', keepAlive: true, permission: ['financeHome'] },
        component: () => import('@/views/finance/suppliers/homePage/')
        // children: [

        // ]
      },
      // {
      //   path: '/finance-manage/finance-suppliers-paymentManagement',
      //   name: 'FinanceManager',
      //   meta: { title: '支付管理', keepAlive: true, permission: ['FinanceManager'] },
      //   component: RouteView,
      //   children: [

      //   ]
      // },
      {
        path: '/finance-manage/finance-suppliers-paymentManagement',
        name: 'FinanceManager',
        component: () => import('@/views/finance/suppliers/paymentManagement/'),
        meta: {
          title: '支付管理',
          keepAlive: true,
          permission: ['FinanceManager']
        }
      },

      // {
      //   path: '/finance-manage/bond-manage',
      //   name: 'BondManage',
      //   meta: { title: '保证金管理', keepAlive: true, permission: ['BondManage'] },
      //   component: RouteView,
      //   children: [
      //     {
      //       path: '/finance-manage/bond-manage/PlatformMarginList',
      //       name: 'PlatformMarginList',
      //       component: () => import('@/views/finance/PlatformMargin/PlatformMarginList.vue'),
      //       meta: {
      //         title: '平台保证金管理',
      //         keepAlive: true,
      //         permission: ['PlatformMarginList']
      //       }
      //     }
      //   ]
      // },
      {
        path: '/finance-manage/bond-manage1',
        name: 'BondManage1',
        meta: { title: '保证金管理', keepAlive: true, permission: ['BondManage1'] },
        component: RouteView,
        children: [
          {
            path: '/finance-manage/bond-manage/PlatformMarginDetails',
            name: 'PlatformMarginDetails',
            component: () => import('@/views/finance/PlatformMargin/PlatformMarginDetails.vue'),
            meta: {
              title: '平台保证金明细',
              keepAlive: true,
              permission: ['PlatformMarginDetails']
            }
          }
        ]
      },
      {
        path: '/finance-manage/fell-manage',
        name: 'FellManage',
        meta: { title: '费用管理 ', keepAlive: true, permission: ['FellManage'] },
        component: RouteView,
        children: [
          {
            path: '/finance-manage/fell-manage/payable-manage',
            name: 'SupplierPayableManage',
            component: () => import('@/views/finance/payable/custom/custom'),
            meta: {
              title: '应付管理',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['SupplierPayableManage']
            }
          },
          {
            path: '/finance-manage/fell-manage/PayableManage-Detail/:id',
            name: 'SupplierPayableManageDetail',
            hidden: true,
            component: () => import('@/views/finance/payable/auditstate/auditstate'),
            meta: {
              title: '应付单详情',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['SupplierPayableManage']
            }
          },
          {
            path: '/finance-manage/fell-manage/payment-manage',
            name: 'SuppliersPaymentManage',
            component: () => import('@/views/finance/payment/supplierPayment'),
            meta: {
              title: '付款管理',
              permission: ['SuppliersPaymentManage']
            }
          },

          {
            path: '/finance-manage/fell-manage/payment-detail/:id',
            name: 'SuppliersPaymentManageDetail',
            component: () => import('@/views/finance/payment/paymentDetails'),
            hidden: true,
            meta: {
              title: '付款单详情',
              permission: ['SuppliersPaymentManage']
            }
          },
          {
            path: '/finance-manage/fell-manage/invoice',
            name: 'SupplieInvoiceHome',
            component: () => import('@/views/finance/suppliers/invoice/'),
            meta: {
              title: '发票管理',
              permission: ['SupplieInvoiceHome']
            }
          },
          {
            path: '/finance-manage/invoiceDetails/:id',
            name: 'suppliersInvoiceDetails',
            hidden: true,
            component: () => import('@/views/finance/operators/invoiceDetails'),
            meta: {
              title: '发票详情',
              permission: ['SupplieInvoiceHome']
            }
          }
        ]
      },
      {
        path: '/finance-manage/penaltyManagement',
        name: 'FinancePenaltyManagement',
        meta: { title: '罚款管理', keepAlive: true, permission: ['FinancePenaltyManagement'] },
        component: () => import('@/views/finance/suppliers/penaltyManagement/')
      },
      {
        path: '/finance-manage/setting',
        name: 'FinanceSetting',
        meta: { title: '设置', keepAlive: true, permission: ['FinanceSetting'] },
        component: RouteView,
        children: [
          {
            path: '/finance-manage/setting/auditSettings',
            name: 'FinanceAuditSettings',
            component: () => import('@/views/finance/operators/setting/auditSettings/'),
            meta: {
              title: '审核设置',
              permission: ['FinanceAuditSettings']
            }
          }
        ]
      }
    ]
  }
  // {
  //   path: 'finance-suppliers-Recharge',
  //   name: 'financeSuppliersRecharge',
  //   meta: { title: '充值', keepAlive: true, permission: ['PurchaseAddAudit'] },
  //   component: () => import('@/views/finance/suppliers/Recharge/Recharge')
  // }
]
