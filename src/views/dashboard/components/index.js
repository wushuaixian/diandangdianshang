/*
 * @Author: your name
 * @Date: 2021-08-11 13:26:29
 * @LastEditTime: 2021-08-13 11:03:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/dashboard/components/index.js
 */
// 每个平台对应的快捷入口
export const quickEntranceList = {
  1: [
    {
      title: '员工管理',
      linkName: '',
      icon: 'supplierWorkbenchIcon/userManagement.png'
    },
    {
      title: '角色管理',
      linkName: '',
      icon: 'supplierWorkbenchIcon/roleManagement.png'
    },
    {
      title: '审批待办',
      linkName: '',
      icon: 'supplierWorkbenchIcon/approvalToDo.png'
    },
    {
      title: '平台保证金',
      linkName: '',
      icon: 'supplierWorkbenchIcon/platformMargin.png'
    },
    {
      title: '采购商寻源保证金',
      linkName: '',
      icon: 'supplierWorkbenchIcon/purchaserDemandGuarantee.png'
    },
    {
      title: '供应商寻源保证金',
      linkName: '',
      icon: 'supplierWorkbenchIcon/supplierDemandFulfillmentMargin.png'
    },
    {
      title: '标书费设置',
      linkName: '',
      icon: 'supplierWorkbenchIcon/bidFeeSetting.png'
    },
    {
      title: '保证金罚扣比例',
      linkName: '',
      icon: 'supplierWorkbenchIcon/marginPenaltyRatio.png'
    }
  ],
  6: [
    {
      title: '用户管理',
      linkName: '',
      icon: 'supplierWorkbenchIcon/userManagement.png'
    },
    {
      title: '角色管理',
      linkName: '',
      icon: 'supplierWorkbenchIcon/roleManagement.png'
    },
    {
      title: '审批待办',
      linkName: '',
      icon: 'supplierWorkbenchIcon/approvalToDo.png'
    },
    {
      title: '我的项目',
      linkName: '',
      icon: 'supplierWorkbenchIcon/myProject.png'
    },
    {
      title: '增值服务',
      linkName: '',
      icon: 'supplierWorkbenchIcon/valueAddedServices.png'
    },
    {
      title: '叮当账户',
      linkName: '',
      icon: 'supplierWorkbenchIcon/jingleAccount.png'
    }
  ],
  7: [
    {
      title: '用户管理',
      linkName: '',
      icon: 'supplierWorkbenchIcon/userManagement.png'
    },
    {
      title: '角色管理',
      linkName: '',
      icon: 'supplierWorkbenchIcon/roleManagement.png'
    },
    {
      title: '新建计划',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/newPlan.png'
    },
    {
      title: '配置采购员',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/configureBuyer.png'
    },
    {
      title: '采购合同',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/purchaseContract.png'
    },
    {
      title: '添加合同模版',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/addContractTemplate.png'
    },
    {
      title: '企业招标',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/enterpriseBidding.png'
    },
    {
      title: '我的列席项目',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/myAttendanceItems.png'
    },
    {
      title: '我的监标项目',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/mySupervisionProject.png'
    },
    {
      title: '我的专家库',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/myExpertLibrary.png'
    },
    {
      title: '我的监标人',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/mySupervisor.png'
    },
    {
      title: '添加公告模版',
      linkName: '',
      icon: 'purchaserWorkbenchIcon/addAnnouncementTemplate.png'
    },
    {
      title: '审批待办',
      linkName: '',
      icon: 'supplierWorkbenchIcon/approvalToDo.png'
    },
    {
      title: '叮当账户',
      linkName: '',
      icon: 'supplierWorkbenchIcon/jingleAccount.png'
    }
  ]
}
// 每个模块对应的展示信息
export const modelInfo = [
  // 合同管理
  {
    type: 'contract',
    title: '合同管理',
    list: [
      {
        typeEn: 'contractWaitConfirm',
        typeZh: '待确认',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/toBeConfirmed.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'contractWaitSign',
        typeZh: '待签署',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/toBeSigned.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  },
  // 订单管理
  {
    type: 'order',
    title: '订单管理',
    list: [
      {
        typeEn: 'orderWaitSend',
        typeZh: '订单待发货',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/orderWaitSend.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'orderWaitExamine',
        typeZh: '订单待验收',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/orderWaitExamine.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'orderWaitOut',
        typeZh: '订单待出库',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/orderWaitOut.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'orderWaitSale',
        typeZh: '订单待售后',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/orderWaitSale.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'orderWaitSendp',
        typeZh: '订单待发货',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/orderWaitSendp.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'orderWaitReceive',
        typeZh: '订单待收货',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/orderWaitReceive.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'orderWaitStore',
        typeZh: '订单待入库',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/orderWaitStore.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'orderWaitSalep',
        typeZh: '订单待售后',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/orderWaitSale.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  },
  //  财务中心
  {
    type: 'finance',
    title: '财务中心',
    list: [
      {
        typeEn: 'financeWaitApplyCount',
        typeZh: '待申请付款（数量）',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/financeWaitApplyCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitPayCount',
        typeZh: '待付款（数量）',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/financeWaitPayCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitFineCount',
        typeZh: '待确认罚款（数量）',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/financeWaitFineCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitInvoiceCount',
        typeZh: '待开票（数量）',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financeWaitInvoiceCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitUploadCount',
        typeZh: '待上传发票（数量）',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financeWaitUploadCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitApplyBankCount',
        typeZh: '待申请-银承（数量）',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financeWaitApplyBankCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitDrawBankCount',
        typeZh: '待提票-银承（数量）',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financeWaitDrawBankCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitApply',
        typeZh: '待申请',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/financeWaitApplyCount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitPay',
        typeZh: '待付款',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financeWaitPay.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitFine',
        typeZh: '待罚款',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financeWaitFine.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeRefundDepositAudit',
        typeZh: '退保证金待审核',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/financeRefundDepositAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeFreeDepositAudit',
        typeZh: '免保证金待审核',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financeFreeDepositAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financePayAuthAudit',
        typeZh: '支付授权待审核',
        name: '',
        query: '',
        disabled: false,
        icon: 'supplierWorkbenchIcon/financePayAuthAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitInvoce',
        typeZh: '待开票',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/financeWaitInvoce.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeCashWaitConfirm',
        typeZh: '收款管理待确认',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/financeCashWaitConfirm.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitReceive',
        typeZh: '待签收-银承',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/financeWaitReceive.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitDiscount',
        typeZh: '待贴现-银承',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/financeWaitDiscount.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'financeWaitBack',
        typeZh: '待背书-银承',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/financeWaitBack.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  },
  // 计划管理
  {
    type: 'plan',
    title: '计划管理',
    list: [
      {
        typeEn: 'planWithApply',
        typeZh: '计划待分配',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/planWithApply.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'planWithExecute',
        typeZh: '计划待执行',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/planWithExecute.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'planWithLongOrder',
        typeZh: '计划长协待下单',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/planWithLongOrder.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'planWithRetailOrder',
        typeZh: '计划零采待下单',
        name: '',
        query: '',
        disabled: false,
        icon: 'purchaserWorkbenchIcon/planWithRetailOrder.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  },
  // 商品中心
  {
    type: 'product',
    title: '商品中心',
    list: [
      {
        typeEn: 'productApprove',
        typeZh: '商品发布审批',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/productApprove.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'productCompareApprove',
        typeZh: '商品发布对比审批',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/productCompareApprove.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'productMaterialApprove',
        typeZh: '寻源物料关联审批',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/productMaterialApprove.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'productBrandApprove',
        typeZh: '品牌申请审批',
        name: '',
        query: '',
        disabled: false,
        icon: 'operationWorkbenchIcon/productBrandApprove.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  },
  // 黑名单
  {
    type: 'black',
    title: '黑名单',
    list: [
      {
        typeEn: 'blackSupplierAudit',
        typeZh: '供应商不良记录待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/blackSupplierAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'blackRemoveAudit',
        typeZh: '移除黑名单的待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/blackRemoveAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'blackBadAppealHandle',
        typeZh: '不良记录申诉待处理',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/blackBadAppealHandle.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'blackBadAppealAudit',
        typeZh: '不良记录申诉待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/blackBadAppealAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'blackComplainWait',
        typeZh: '投诉管理待办',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/blackComplainWait.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'blackComplainAudit',
        typeZh: '投诉管理待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/blackComplainAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  },
  {
    type: 'merchant',
    title: '企业信息管理',
    list: [
      {
        typeEn: 'merchantSupplierAudit',
        typeZh: '供应商准入待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantSupplierAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'merchantPurchaserAudit',
        typeZh: '采购商准入待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantPurchaserAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'merchantCategoryAudit',
        typeZh: '品类待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantCategoryAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'merchantBusinessComplainAudit',
        typeZh: '工商信息申诉待处理',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantBusinessComplainAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'merchantAuthComplainAudit',
        typeZh: '认证信息申诉待处理',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantAuthComplainAudit.png',
        disabledIcon: 'operationWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'merchantWaitAuth',
        typeZh: '待认证',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantWaitAuth.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'merchantAuthAudit',
        typeZh: '认证待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantAuthAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'merchantSupplierChange',
        typeZh: '供应商调级待审核',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/merchantSupplierChange.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  },
  {
    type: 'xuanyuanguanli',
    title: '寻源管理',
    list: [
      {
        typeEn: 'xunyuanguanliWaitSignUp',
        typeZh: '待报名（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'supplierWorkbenchIcon/xunyuanguanliWaitSignUp.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitConfirm',
        typeZh: '待确认（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'supplierWorkbenchIcon/xunyuanguanliWaitConfirm.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitQuote',
        typeZh: '待报价（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'operationWorkbenchIcon/xunyuanguanliWaitQuote.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitBid',
        typeZh: '待开标（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'supplierWorkbenchIcon/xunyuanguanliWaitBid.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitConfirmResult',
        typeZh: '待确认结果（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'supplierWorkbenchIcon/xunyuanguanliWaitQuote.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitEstab',
        typeZh: '待立项（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'purchaserWorkbenchIcon/xunyuanguanliWaitEstab.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitIssue',
        typeZh: '待发布公告（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'purchaserWorkbenchIcon/xunyuanguanliWaitIssue.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitAudit',
        typeZh: '待报名审核（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'purchaserWorkbenchIcon/xunyuanguanliWaitAudit.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitIssueBid',
        typeZh: '待发布招标文件（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'purchaserWorkbenchIcon/xunyuanguanliWaitIssueBid.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitOpen',
        typeZh: '待开启（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'purchaserWorkbenchIcon/xunyuanguanliWaitOpen.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitEvaluate',
        typeZh: '待评标（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'purchaserWorkbenchIcon/xunyuanguanliWaitEvaluate.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      },
      {
        typeEn: 'xunyuanguanliWaitNotice',
        typeZh: '待发布中标通知书（数量）',
        name: '',
        query: '',
        disabled: true,
        icon: 'purchaserWorkbenchIcon/xunyuanguanliWaitNotice.png',
        disabledIcon: 'supplierWorkbenchIcon/userManagement.png'
      }
    ]
  }
]
