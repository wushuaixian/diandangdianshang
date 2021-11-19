import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
import { getMenus } from '@/api/menu'
import { getUserIdentityPlatformList } from '@/api/user'
import cookie from '@/utils/cookie'
import { PLATFORM_ID } from '@/store/mutation-types'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission(permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter(routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    platformList: [],
    isPlatform: null,
    yzbRouters: null,
    isShowCustomerService: false,
    menuList: [] // 菜单列表
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_YZBROUTERS: (state, routers) => {
      state.yzbRouters = routers
    },
    SET_IS_CUSTOMER_SERVICE: (state, data) => {
      state.isShowCustomerService = data
    }
  },
  actions: {
    async GenerateRoutes({ commit, state }, data) {
      try {
        const res = await getMenus({ platformId: state.isPlatform, parentCode: '30' })
        if (res.code === '0') {
          const roles = (function getRoles(menus) {
            return menus
              .map(x => {
                if (x.childs && x.childs.length > 0) {
                  const ids = getRoles(x.childs)
                  return [...ids, x.id]
                }
                return x.id
              })
              .flat()
          })(res.data)
          const yzb = res?.data?.find(x => x.name === '寻源管理')
          const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
          commit('setState', { key: ['permission', 'menuList'], value: res.data })
          commit('SET_ROUTERS', accessedRouters)
          commit('SET_YZBROUTERS', yzb)
        }
      } catch (error) {
        throw error
      }
    },
    async GetUserPlatformList({ commit }, data) {
      try {
        const res = await getUserIdentityPlatformList({})
        const value = res?.data.map(x => x.platformId)
        const localPlatformId = Number(cookie.getItem('isPlatform'))
        if (!value.includes(localPlatformId)) {
          cookie.setItem('isPlatform', value[0])
          cookie.set(PLATFORM_ID, value[0])
        }
        commit('setState', { key: ['permission', 'platformList'], value })
      } catch (error) {
        throw error
      }
    },
    async refreshFrontPlatform({ commit, dispatch, state }, data) {
      try {
        if (cookie.getItem('isPlatform')) {
          commit('setState', { key: ['permission', 'isPlatform'], value: Number(cookie.getItem('isPlatform')) })
        } else {
          const [value] = state?.platformList
          cookie.setItem('isPlatform', value)
          cookie.set(PLATFORM_ID, value)
          commit('setState', { key: ['permission', 'isPlatform'], value })
        }
        return true
      } catch (error) {
        throw error
      }
    },
    setIsShowCustomerService({ commit, dispatch, state }, data) {
      commit('SET_IS_CUSTOMER_SERVICE', data)
    }
  }
}

export default permission
