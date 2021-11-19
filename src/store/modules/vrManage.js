const vrManage = {
  state: {
    vrinfo: {}
  },
  mutations: {
    SET_VR_INFO(state, data) {
      state.vrinfo = data
    }
  },
  actions: {
    ACTION_VR_INFO(context, data) {
      context.commit('SET_VR_INFO', data)
    }
  }
}

export default vrManage
