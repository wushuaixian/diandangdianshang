export const checkData = (data, _this) => {
  for (const item of data) {
    if (!item?.taxRate) {
      _this.$message.error('请填写税率')
      return false
    }
    if (!item?.priceWithTax) {
      _this.$message.error('请填写含税单价')
      return false
    }
    if (!item?.orderNum) {
      _this.$message.error('请填写下单数量')
      return false
    }
    if (!item?.deliveryTime) {
      _this.$message.error('请选择交货日期')
      return false
    }
  }
  return true
}
