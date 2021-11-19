const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}
export default [
  {
    path: '/sys-finance-manage',
    // path: '/finance-manage',
    name: 'SysFinanceManagement',
    component: RouteView,
    meta: { title: '财务中心', icon: 'user', keepAlive: true, permission: ['SysFinanceManagement'] },
    children: [
      {
        path: '/sys-finance-manage/operators-home',
        name: 'SysOperatorsHome',
        meta: {
          title: '叮当账户',
          keepAlive: true,
          permission: ['SysOperatorsHome']
        },
        component: () => import('@/views/finance/operators/homePage/')
      },
      {
        path: '/sys-finance-manage/finance-suppliers-paymentManagement',
        name: 'SysFinanceSuppliersPaymentManagement',
        meta: { title: '支付管理', keepAlive: true, permission: ['SysFinanceSuppliersPaymentManagement'] },
        component: RouteView,
        redirect: '/sys-finance-manage/finance-suppliers-paymentManagement',
        children: [
          {
            path: '/sys-finance-manage/finance-suppliers-paymentManagement',
            name: 'SysFinanceSuppliersPaymentManagementTwo',
            meta: { title: '支付管理', keepAlive: true, permission: ['SysFinanceSuppliersPaymentManagementTwo'] },
            component: () => import('@/views/finance/suppliers/paymentManagement/')
          },
          {
            path: '/sys-finance-manage/authoriz-AtionAudit',
            name: 'AuthorizationAuditReview',
            component: () => import('@/views/finance/operators/authorizationAudit/'),
            meta: {
              title: '支付授权审核',
              permission: ['AuthorizationAuditReview']
            }
          },
          {
            path: '/sys-finance-manage/changeBankExamine',
            name: 'changeBankExamineReview',
            component: () => import('@/views/finance/operators/changeBankExamine/'),
            meta: {
              title: '换绑银行账户授权审核',
              permission: ['changeBankExamineReview']
            }
          }
        ]
      },

      // {
      //   path: '/sys-finance-manage/finance-suppliers-deactivation',
      //   name: 'SysFinanceSuppliersdeactivation',
      //   hidden: true,
      //   meta: { title: '账户激活引导', keepAlive: true, permission: ['SysFinanceSuppliersdeactivation'] },
      //   component: () => import('@/views/finance/suppliers/paymentManagement/deactivation')
      // },
      // {
      //   path: '/sys-finance-manage/finance-payment-Cashier/:code/:type/:id',
      //   name: 'SysFinancePaymentCashier',
      //   hidden: true,
      //   meta: { title: '收银台页面', keepAlive: true, permission: ['SysFinancePaymentCashier'] },
      //   component: () => import('@/views/finance/payment/Cashier')
      // },
      {
        path: '/sys-finance-manage/bond-manage',
        name: 'SysBondManageReview',
        meta: { title: '保证金管理', keepAlive: true, permission: ['SysBondManageReview'] },
        component: RouteView,
        children: [
          {
            path: '/sys-finance-manage/bond-manage/PlatformMarginList',
            name: 'SysPlatformMarginList',
            component: () => import('@/views/finance/PlatformMargin/PlatformMarginList.vue'),
            meta: {
              title: '平台保证金管理',
              keepAlive: true,
              permission: ['SysPlatformMarginList']
            }
          },
          {
            path: '/sys-finance-manage/bond-manage/scratchButtonList',
            name: 'SysscratchButtonList',
            component: () => import('@/views/finance/PlatformMargin/scratchButtonList.vue'),
            meta: {
              title: '平台保证金划扣',
              keepAlive: true,
              permission: ['SysscratchButtonList']
            }
          },
          {
            path: '/sys-finance-manage/bond-manage/returnList',
            name: 'SysReturnList',
            component: () => import('@/views/finance/PlatformMargin/returnList.vue'),
            meta: {
              title: '平台保证金退还',
              keepAlive: true,
              permission: ['SysReturnList']
            }
          }
        ]
      },
      {
        path: '/sys-finance-manage/fell-manage',
        // path: '/finance-manage/fell-manage',
        name: 'SysFellManage',
        meta: { title: '费用管理 ', keepAlive: true, permission: ['SysFellManage'] },
        // meta: { title: '费用管理 ', keepAlive: true, permission: ['FellManage'] },
        component: RouteView,
        children: [
          {
            path: '/sys-finance-manage/fell-manage/payable-manage',
            name: 'SysSupplierPayableManage',
            component: () => import('@/views/finance/payable/custom/custom'),
            meta: {
              title: '应付管理',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['SysSupplierPayableManage']
              // permission: ['SupplierPayableManage']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/payable-detail/:id',
            name: 'SysSupplierPayableManageDetail',
            hidden: true,
            component: () => import('@/views/finance/payable/auditstate/auditstate'),
            meta: {
              title: '应付单详情',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['SysSupplierPayableManage']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/payment-manage',
            name: 'SysPaymentManage',
            component: () => import('@/views/finance/payment/supplierPayment'),
            meta: {
              title: '付款管理',
              permission: ['SysPaymentManage']
              // permission: ['SuppliersPaymentManage']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/payment-detail/:id',
            name: 'SysPaymentManageDetail',
            hidden: true,
            component: () => import('@/views/finance/payment/paymentDetails'),
            meta: {
              title: '付款单详情',
              permission: ['SysPaymentManage']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/invoice',
            name: 'SysoperatorsInvoices',
            component: () => import('@/views/finance/operators/invoice'),
            meta: {
              title: '发票管理',
              permission: ['SysoperatorsInvoices']
              // permission: ['SupplieInvoiceHome']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/InvoiceDetails/:id',
            name: 'SysoperatorsInvoiceDetails',
            hidden: true,
            component: () => import('@/views/finance/operators/invoiceDetails'),
            meta: {
              title: '发票详情',
              permission: ['SysoperatorsInvoices']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/collection-manage',
            name: 'SysCollectionManage',
            component: () => import('@/views/finance/collection/collectionManagement/collectionManagement'),
            meta: {
              title: '收款管理',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['SysCollectionManage']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/collection-detail/:id',
            name: 'SysCollectionDetail',
            hidden: true,
            component: () => import('@/views/finance/collection/receiptDetails/receiptDetails'),
            meta: {
              title: '收款单详情',
              keepAlive: false,
              hiddenHeaderContent: true,
              permission: ['SysCollectionManage']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/payment-records',
            name: 'SysPaymentRecords',
            component: () => import('@/views/finance/suppliers/paymentRecords'),
            meta: {
              title: '付款记录',
              permission: ['SysPaymentRecords']
            }
          },
          {
            path: '/sys-finance-manage/fell-manage/payment-records-detail',
            name: 'SysPaymentRecordsDetail',
            hidden: true,
            component: () => import('@/views/finance/suppliers/paymentComplete'),
            meta: {
              title: '付款记录详情',
              permission: ['SysPaymentRecords']
            }
          }
        ]
      },
      {
        path: '/sys-finance-manage/penaltyManagement',
        name: 'SysFinancePenaltyManagement',
        meta: { title: '罚款管理', keepAlive: true, permission: ['SysFinancePenaltyManagement'] },
        component: RouteView,
        children: [
          {
            path: '/sys-finance-manage/penaltyManagement/supplier',
            name: 'SysFinancePenaltyManagementSupplier',
            component: () => import('@/views/finance/operators/penaltyManagementSupper/'),
            meta: {
              title: '平台罚款管理',
              permission: ['SysFinancePenaltyManagementSupplier']
            }
          },
          {
            path: '/sys-finance-manage/penaltyManagement/purchasers',
            name: 'SysFinancePenaltyManagementPurchasers',
            component: () => import('@/views/finance/operators/penaltyManagementPurchasers/'),
            meta: {
              title: '商家罚款管理',
              permission: ['SysFinancePenaltyManagementPurchasers']
            }
          }
        ]
      },
      {
        path: '/sys-finance-manage/administration',
        name: 'sysFinanceAdministration',
        meta: { title: '财务管理', keepAlive: true, permission: ['sysFinanceAdministration'] },
        component: RouteView,
        children: [
          {
            path: '/sys-finance-manage/administration/businessBalanceAdministrator',
            name: 'sysBusinessBalanceAdministrator',
            component: () => import('@/views/finance/operators/adminstration/businessBalanceAdministrator/'),
            meta: {
              title: '商家余额管理',
              permission: ['sysBusinessBalanceAdministrator']
            }
          },
          {
            path: '/sys-finance-manage/administration/businessBalanceAdministratorDetailed/:merchantId',
            name: 'sysBusinessBalanceAdministratordetailed',
            component: () => import('@/views/finance/operators/adminstration/businessBalanceAdministrator/detailed'),
            hidden: true,
            meta: {
              title: '商家余额管理明细',
              permission: ['sysBusinessBalanceAdministrator']
            }
          }
        ]
      },
      {
        path: '/sys-finance-manage/setting',
        name: 'SysFinanceSetting',
        meta: { title: '设置', keepAlive: true, permission: ['SysFinanceSetting'] },
        component: RouteView,
        children: [
          {
            path: '/sys-finance-manage/setting/auditSettings',
            name: 'SysFinanceAuditSettings',
            component: () => import('@/views/finance/operators/setting/auditSettings/'),
            meta: {
              title: '审核设置',
              permission: ['SysFinanceAuditSettings']
            }
          }
        ]
      }
    ]
  }
]
