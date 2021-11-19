/*
 * @Author: your name
 * @Date: 2021-07-02 22:31:11
 * @LastEditTime: 2021-08-15 14:37:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit: 0
 * @FilePath: /fte_manage_integrated/src/store/modules/planManage.js
 */
const planManage = {
  state: {
    implementActive: 0,
    matchContractList: [],
    countPendingExecuteObject: {
      pendingExecute: 0,
      findSource: 0,
      executeClosed: 0,
      longTermOrder: 0,
      detailOrder: 0,
      orderNumCount: 0
    }
  },
  mutations: {
    // setState(state, data) {
    //   state.implementActive = data.value
    //   console.log(data, 'sadasdasdas')
    // },
    setCountPendingExecuteObject(state, data) {
      state.countPendingExecuteObject[data.text] = data.value
    }
  },

  actions: {}
}

export default planManage
