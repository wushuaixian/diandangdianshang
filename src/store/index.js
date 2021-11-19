import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import register from './modules/register'
import planManage from './modules/planManage'
import organization from './modules/organization'
import purchaseManage from './modules/purchaseManage'
import contract from './modules/contract'
import order from './modules/order'
import vrManage from './modules/vrManage'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    register,
    permission,
    planManage,
    organization,
    purchaseManage,
    contract,
    order,
    vrManage
  },
  state: {
    isLogin: false,
    enterpriseNature: ''
  },
  mutations: {
    // 设置state值   第一层setState({key: 'name', value: 'Lee'}) 具体某个module etState({ key: ['user', 'registerStep'], value: '111' })
    setState(state, val) {
      const { key, value } = val
      if (!!key && key instanceof Array && key.length > 0) {
        const [parentKey, childrenKey] = key
        state[parentKey][childrenKey] = value
      } else {
        state[key] = value
      }
    },
    enterpriseNature(state, data) {
      state.enterpriseNature = data
    }
  },
  actions: {},
  getters
})
