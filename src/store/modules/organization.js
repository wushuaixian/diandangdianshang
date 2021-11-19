const organization = {
  state: {
    departmentType: ''
  },
  mutations: {
    MUTATIONS_SET_DEPARTMENT_TYPE (state, data) {
      state.departmentType = data
    }
  },
  actions: {
    ACTION_SET_DEPARTMENT_TYPE (context, data) {
      context.commit('MUTATIONS_SET_DEPARTMENT_TYPE', data)
    }
  }
}

export default organization
