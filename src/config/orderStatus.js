/*
 * @Author: your name
 * @Date: 2021-07-17 13:40:45
 * @LastEditTime: 2021-08-06 09:56:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/config/orderStatus.js
 */
// const exoprtFile = [
//   'id',
//   'createUserid',
//   'createTime',
//   'updateUserid',
//   'updateTime',
//   'createUsername',
//   'updateUsername',
//   'companyId',
//   'isDeleted',
//   'copyOrderCode',
//   'orderCode',
//   'parentOrderCode',
//   'isLeaf',
//   'userId',
//   'userName',
//   'merchantId',
//   'customerId',
//   'customerName',
//   'customerType',
//   'orderAmount',
//   'productAmount',
//   'currency',
//   'currencyName',
//   'currencyRate',
//   'currencySymbol',
//   'taxAmount',
//   'orderStatus',
//   'orderPaymentType',
//   'orderPaymentStatus',
//   'orderPaymentConfirmDate',
//   'orderDeliveryFee',
//   'orderPaidByCoupon',
//   'orderPromotionDiscount',
//   'orderGivePoints',
//   'orderCancelReasonId',
//   'orderCancelDate',
//   'orderCsCancelReason',
//   'orderCanceOperateType',
//   'orderCanceOperateId',
//   'orderDeliveryMethodId',
//   'orderRemarkUser',
//   'orderRemarkMerchant2user',
//   'orderRemarkMerchant',
//   'orderSource',
//   'orderChannel',
//   'orderPromotionStatus',
//   'goodReceiverAddress',
//   'goodReceiverPostcode',
//   'goodReceiverName',
//   'goodReceiverMobile',
//   'goodReceiverCountry',
//   'goodReceiverProvince',
//   'goodReceiverCity',
//   'goodReceiverCounty',
//   'goodReceiverArea',
//   'identityCardNumber',
//   'orderLogisticsTime',
//   'orderReceiveDate',
//   'orderDeleteStatus',
//   'isAvailable',
//   'orderBeforeAmount',
//   'orderBeforeDeliveryFee',
//   'sysSource',
//   'outOrderCode',
//   'commentStatus',
//   'merchantName',
//   'orderRemarkCompany',
//   'orderCompleteDate',
//   'orderType',
//   'goodReceiverCountryCode',
//   'goodReceiverProvinceCode',
//   'goodReceiverCityCode',
//   'goodReceiverAreaCode',
//   'storeId',
//   'storeName',
//   'orderLabel',
//   'expectDeliverDate',
//   'cashier',
//   'orderCreateTime',
//   'soItemList',
//   'sourceCode',
//   'mealType',
//   'equipCode',
//   'tableName',
//   'mealsNum',
//   'seqNo',
//   'extInfo',
//   'childOrderList',
//   'type',
//   'soShareAmountVO',
//   'errorRemark',
//   'deliveryCompanyId',
//   'extField1',
//   'extField2',
//   'extField3',
//   'extField4',
//   'extField5',
//   'sysSourceStr',
//   'productCname',
//   'code',
//   'thirdMerchantProductCode',
//   'barCode',
//   'artNo',
//   'brandName',
//   'wholeCategoryName',
//   'categoryName',
//   'unit',
//   'productItemNum',
//   'productItemAmount',
//   'warehouseName',
//   'freightTemplateId',
//   'warehouseId',
//   'warehouseType',
//   'orderDeliveryMethodStr',
//   'itemIdList',
//   'orderSourceStr',
//   'orderStatusStr',
//   'orderCancelReasonStr',
//   'orderTotalAmount',
//   'orderChannelStr',
//   'orderPaymentTypeStr',
//   'discountedAllPrice',
//   'orderPaymentStatusStr',
//   'customerTypeStr',
//   'freightDiscountAmount',
//   'tableNo',
//   'mealTypeStr',
//   'realItemPrice',
//   'change',
//   'orderTypeStr',
//   'buyerId',
//   'buyerName'
// ]
// 1011 待提交(采购商)
// 1030 待确认(供应商)
// 1031 已确认(供应商)
// 1032 确认驳回(供应商)
// 1040 待审核(供应商)
// 1041 审核驳回(供应商)
// 1050 供应商审核通过
// 1062 审核通过(采购商)
// 1063 审核驳回(采购商)
// 9000 已关闭(已取消)
export const orderStatus = [
  {
    orderStatus: null,
    orderStatusText: '全部'
  },
  // {
  //   orderStatus: 1010,
  //   orderStatusText: '待支付',
  // },
  // {
  //   orderStatus: 1020,
  //   orderStatusText: '已支付',
  // },
  {
    orderStatus: 1030,
    orderStatusText: '待确认'
  },
  {
    orderStatus: 1031,
    orderStatusText: '已确认'
  },
  // {
  //   orderStatus: 1032,
  //   orderStatusText: '确认驳回(供应商)'
  // },
  {
    orderStatus: 1032,
    orderStatusText: '未通过'
  },
  {
    orderStatus: 1040,
    orderStatusText: '待审核'
  },
  {
    orderStatus: 1041,
    orderStatusText: '审核驳回'
  },
  {
    orderStatus: 1050,
    orderStatusText: '审核通过'
  },
  // {
  //   orderStatus: 1063,
  //   orderStatusText: '审核驳回(采购商)'
  // },
  // {
  //   orderStatus: 1000,
  //   orderStatusText: '待发货'
  // },
  // {
  //   orderStatus: 1060,
  //   orderStatusText: '已发货'
  // },
  // {
  //   orderStatus: 1070,
  //   orderStatusText: '已签收'
  // },
  // {
  //   orderStatus: 1999,
  //   orderStatusText: '已完成'
  // },
  {
    orderStatus: 9000,
    orderStatusText: '已取消'
  }
]
export const orderBtn = [
  {
    text: '批量确认',
    status: [1030],
    type: 'primary',
    function: 'batchConfirmation'
  },
  {
    text: '批量发货',
    status: [],
    type: 'primary',
    function: 'bulkDelivery'
  },
  {
    text: '批量取消订单',
    status: [],
    type: 'primary',
    function: 'batchCancelOrder'
  },
  {
    text: '批量审核',
    status: [1040],
    type: 'primary',
    function: 'batchAudit'
  }
  // {
  //   text: '导出订单',
  //   status: [null, 1030, 1031, 1032, 1040, 1041, 1050, 1063, 1000, 9000],
  //   type: 'primary',
  //   function: 'exportantOrder',
  //   exoprtFile
  // },
  // {
  //   text: '导出订单行',
  //   status: [null, 1030, 1031, 1032, 1040, 1041, 1050, 1063, 1000, 9000],
  //   type: 'primary',
  //   function: 'exportItemDataFn',
  //   exoprtFile
  // },
  // {
  //   text: '查看任务',
  //   status: [null, 1030, 1031, 1032, 1040, 1041, 1050, 1063, 1000, 9000],
  //   type: 'primary',
  //   function: 'viewTasks'
  // }
]
// 订单审核列表的数据
export const orderApprovalList = {
  searchForm: [
    {
      value: 1,
      label: '订单号'
    },
    {
      value: 2,
      label: '外部订单号'
    },
    {
      value: 3,
      label: '收货人姓名'
    },
    {
      value: 4,
      label: '商品编码'
    }
  ],
  orderApprovalStatus: [
    {
      status: 1,
      statusText: '待审核'
    },
    {
      status: 2,
      statusText: '审核通过'
    },
    {
      status: 3,
      statusText: '审核不通过'
    }
  ],
  // 订单审核状态
  auditStatus: [
    {
      value: '1',
      label: '待审核'
    },
    {
      value: '2',
      label: '审核通过'
    },
    {
      value: '3',
      label: '审核不通过'
    }
  ],
  // 订单状态
  orderStatus: [
    // {
    //   value: 1010,
    //   label: '待审核'
    // },
    // {
    //   value: 1020,
    //   label: '已支付'
    // },
    {
      value: 1030,
      label: '待确认'
    },
    {
      value: 1031,
      label: '已确认'
    },
    {
      value: 1032,
      label: '未通过'
    },
    {
      value: 1040,
      label: '待审核'
    },
    {
      value: 1041,
      label: '审核驳回'
    },
    {
      value: 1050,
      label: '审核通过'
    },
    {
      value: 1060,
      label: '已发货'
    },
    // {
    //   value: 1062,
    //   label: '审核通过(采购商)'
    // },
    // {
    //   value: 1070,
    //   label: '已签收'
    // },
    // {
    //   value: 1999,
    //   label: '已完成'
    // },
    {
      value: 9000,
      label: '已取消'
    }
  ],
  // 审核原因
  orderReason: [
    {
      value: '1',
      label: '订单有备注'
    },
    {
      value: '2',
      label: '价格与价套不符'
    },
    {
      value: '3',
      label: '有过人工改价'
    },
    {
      value: '4',
      label: '其他'
    }
  ]
}
// 订单详情列表
export const orderDetail = {
  orderDetailStep: [
    {
      current: 0,
      stepTitle: '提交订单',
      createTime: '2018-12-02 22:11:10'
    },
    {
      current: 1,
      stepTitle: '支付完成',
      createTime: '2018-12-02 22:11:10'
    },
    {
      current: 2,
      stepTitle: '商家发货',
      createTime: '2018-12-02 22:11:10'
    },
    {
      current: 3,
      stepTitle: '完成收货',
      createTime: '2018-12-02 22:11:10'
    },
    {
      current: 4,
      stepTitle: '订单完成',
      createTime: '2018-12-02 22:11:10'
    }
  ],
  orderDetailBtn: [
    {
      text: '审核订单',
      status: [1040],
      type: 'primary',
      function: 'batchConfirmation'
    },
    {
      text: '确认订单',
      status: [1030],
      type: 'primary',
      function: 'sureOrder'
    }
  ],
  orderStatusJson: {
    3: '处理中',
    4: '系统处理中',
    5: '待出库',
    6: '订单已经转',
    21: '订单已经出库',
    22: '订单已经开始派送',
    25: '用户已经收货',
    31: '送货失败',
    34: '订单已经取消',
    35: '订单已经完成',
    1030: '待确认',
    1031: '已确认',
    1032: '未通过',
    1040: '待审核',
    1050: '审核通过',
    1041: '审核驳回',
    9000: '已取消'
  },
  orderTypeJson: {
    0: '普通',
    1: '生鲜类',
    2: '服务类',
    3: '虚拟'
  },
  orderSourceJson: {
    0: '普通',
    1: '团购',
    2: '询价',
    3: '租赁',
    4: '拼单'
  }
}
