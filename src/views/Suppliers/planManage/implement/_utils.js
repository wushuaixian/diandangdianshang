export const checkData = (data, selectRows, _this) => {
  const isContract = data.map(x => x?.contractInfo).filter(x => !!x)
  if (isContract.length !== selectRows.length) {
    _this.$message.warning('请选择合同')
    return false
  }
  for (const item of data) {
    if (!item?.orderNum) {
      _this.$message.error('请填写下单数量')
      return false
    }
  }
  return true
}
