/*
 * @Author: your name
 * @Date: 2021-06-23 19:50:02
 * @LastEditTime: 2021-06-25 01:01:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/store/modules/purchaseManage.js
 */
function reduce (oldData) {
  const newArr = []
  const list = oldData.reduce((pro, cur) => {
    if (newArr && newArr.includes(cur.id)) return pro
    newArr.push(cur.id)
    return [...pro, cur]
  }, [])
  list.forEach((item, index) => {
    item.index = index + 1
  })
  return list
}
const purchaseManage = {
  state: {
    selectedRowKeys: []
  },
  mutations: {
    MUTATIONS_SET_MERCHANT_PURCHASE (state, data) {
      state.selectedRowKeys = data
    }
  },
  actions: {
    ACTIONS_SET_MERCHANT_PURCHASE (context, data) {
      const oldData = [...data, ...context.state?.selectedRowKeys]
      const list = reduce(oldData)
      context.commit('MUTATIONS_SET_MERCHANT_PURCHASE', list)
    },
    ACTIONS_SLICE_SELECTED(context, data) {
      const list = context.state?.selectedRowKeys
      const newlist = reduce(list.filter((item) => {
        console.log(item.id !== data.id)
        return item.id !== data.id
      }))
      context.commit('MUTATIONS_SET_MERCHANT_PURCHASE', newlist)
    }
  }
}

export default purchaseManage
