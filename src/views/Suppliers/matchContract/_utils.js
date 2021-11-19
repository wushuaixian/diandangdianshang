export const checkData = (data, selectRows, _this) => {
  const isContract = data.map(x => x?.contractInfo).filter(x => !!x)
  if (isContract.length !== selectRows.length) {
    _this.$message.warning('请选择合同')
    return false
  }
  for (const item of data) {
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
    // if (!item?.guaranteePeriod) {
    //   _this.$message.error('请填写质保期')
    //   return false
    // }
  }
  return true
}
