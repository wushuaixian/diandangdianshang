export const authStatusList = [
  { label: '全部', value: '' },
  { label: '未认证', value: '-1' },
  { label: '待认证', value: '0' },
  { label: '验厂中', value: '1' },
  { label: '认证中', value: '2' },
  { label: '认证通过', value: '3' },
  { label: '认证不通过', value: '4' }
]

export const transactionType = [
  { label: '套餐费', value: '1' },
  { label: '充值', value: 8 },
  { label: '寻源保证金', value: '11' },
  { label: '标书费', value: '12' },
  { label: '平台保证金', value: '13' },
  { label: '寻源保证金退还', value: '14' },
  { label: '提现', value: '81' },
  { label: '缴纳罚款', value: '16' },
  { label: '平台保证金退还', value: '15' },
  { label: '平台罚款', value: '17' }
]

export const recharge = [
  { label: '待支付', value: '1' },
  { label: '付款中', value: '2' },
  { label: '已付款', value: '3' },
  { label: '超时', value: '4' },
  { label: '失败', value: '5' }
]
export const BIND_PHONE = '绑定手机号'
export const UNBNID_PHONE = '解绑手机号'

export const planTypeList = [
  { label: '年度计划', value: '1' },
  { label: '季度计划', value: '2' },
  { label: '月度计划', value: '3' },
  { label: '临时计划', value: '4' }
]
export const instancyList = [
  { label: '全部', value: '' },
  { label: '否', value: 0 },
  { label: '是', value: 1 }
]
export const buyerPlanCodeList = [
  { label: '全部', value: '' },
  { label: '未配置', value: 0 },
  { label: '已配置', value: 1 }
]
export const materialSourceText = ['物料池导入', '模板导入']

export const ApprovalProcessStatusList = [
  {
    value: '',
    label: '全部'
  },
  {
    value: 0,
    label: '停用'
  },
  {
    value: 1,
    label: '启用'
  }
]

export const fineStatus = [
  {
    value: 1,
    label: '待确认'
  },
  {
    value: 2,
    label: '已拒绝'
  },
  {
    value: 3,
    label: '待支付'
  },
  {
    value: 4,
    label: '已完成'
  },
  {
    value: 5,
    label: '重新发起'
  },
  {
    value: 6,
    label: '待仲裁'
  },
  {
    value: 7,
    label: '已仲裁'
  }
]

export const auditTypeList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '平台审批',
    value: 1
  },
  {
    label: '外部OA审批',
    value: 2
  }
]
export const platformList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '运营平台',
    value: 1
  },
  {
    label: '供应商平台',
    value: 6
  },
  {
    label: '采购商平台',
    value: 7
  }
]

export const AfTaskStatusList = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '待审批',
    value: '1'
  },
  {
    label: '审批通过',
    value: '2'
  },
  {
    label: '审批不通过',
    value: '3'
  }
]
