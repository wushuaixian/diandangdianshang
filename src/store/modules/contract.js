const register = {
  state: {
    tableTemplate: [
      // { name: '采购员', key: 'buyerUserName', span: 12 },
      { name: '物料编码', key: 'materialCode', span: 12 },
      { name: '名称', key: 'materialName', span: 12 },
      { name: '规格型号', key: 'materialModel', span: 12 },
      { name: '数量', key: 'contractMaterialNum', span: 12 },
      { name: '单位', key: 'mpMeasurementUnit', span: 12 },
      { name: '含税单价(元)', key: 'priceWithTax', span: 12 },
      { name: '未税单价(元)', key: 'priceWith', span: 12 },
      { name: '税率', key: 'taxRate', span: 12 },
      { name: '价税合计(元)', key: 'taxAmount', span: 12 },
      { name: '未税总价(元)', key: 'taxAmountWithout', span: 12 },
      { name: '交货日期', key: 'deliveryTime', span: 12 },
      { name: '交货天数', key: 'deliveryDays', span: 12 },
      { name: '生产厂家或品牌', key: 'manufacturer', span: 12 },
      { name: '申请组织', key: 'applyDepartment', span: 12 },
      { name: '计划编号', key: 'planItemCode', span: 12 },
      { name: '采购计划编号', key: 'buyerPlanCode', span: 12 },
      { name: '备注', key: 'remark', span: 12 },
      { name: '质保期', key: 'ext1Info', span: 12 },
      { name: '订单号', key: 'ext2Info', span: 12 },
      { name: '材质', key: 'ext3Info', span: 12 },
      { name: '服务内容', key: 'ext4Info', span: 12 },
      { name: '工期/服务期', key: 'ext5Info', span: 12 }
    ]
  },

  mutations: {
  },

  actions: {
  }
}

export default register
