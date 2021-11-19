import { ACCESS_TOKEN } from '@/store/mutation-types'
import cookie from '@/utils/cookie'
import { getMerchantOrgInfoByOrgId, getUserInfo, logout, userMobile } from '@/api/user'
import { cleanLoginInfo } from '@/utils/auth'

const user = {
  state: {
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    isBindMobile: null
  },
  mutations: {
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 获取用户信息
    async GetInfo({ commit }) {
      const res = await getMerchantOrgInfoByOrgId()
      console.log(res)
      if (res.code === '0') {
        commit('SET_INFO', res.data)
      }
    },
    async GetUserInfo({ commit }) {
      const res = await getUserInfo()
      if (res.code === '0') {
        commit('SET_INFO', { userName: res.username })
      }
    },

    // 登出
    async Logout({ commit, state }) {
      if (cookie.get(ACCESS_TOKEN)) {
        await logout()
      }
      commit('SET_ROLES', [])
      commit('SET_ROUTERS', [])
      cleanLoginInfo()
    },
    async userMobile({ commit }) {
      const res = await userMobile()
      if (res.code === '0') {
        commit('setState', { key: ['user', 'isBindMobile'], value: res.data })
        return res?.data
      }
    }
  }
}

export default user
