import router from './router'
import store from './store'
// import NProgress from 'nprogress' // progress bar
// import '@/components/NProgress/nprogress.less' // progress bar custom style
// import notification from 'ant-design-vue/es/notification'
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { IS_OPEERATE } from '@/store/platform-types'
import { i18nRender } from '@/locales'
import cookie from '@/utils/cookie'
import { cleanLoginInfo } from '@/utils/auth'
// NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'register', 'registerResult', 'forgetpasswd'] // no redirect allowList
const loginRoutePath = '/user/login'
const bindRoutePath = '/user/bind'
const defaultRoutePath = '/workplace'

router.beforeEach(async (to, from, next) => {
  next()
  if (to.path.includes('undefined')) return next()

  // NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  if (cookie.get(ACCESS_TOKEN)) {
    if (!store?.getters.isBindMobile) {
      const mobile = await store.dispatch('userMobile')
      //  没绑定手机号
      if (!mobile) {
        return next({ path: bindRoutePath })
      }
    }
    if (!cookie.getItem('isPlatform') || cookie.getItem('isPlatform') === 'undefined') {
      await store.dispatch('Logout')
      return next({ path: loginRoutePath })
    }
    // 检测去的页面是不是工作台 判断客服图标的展示   start
    const bool = ['workplace'].some(item => {
      return to.path.includes(item)
    })
    if (bool) {
      store.dispatch('setIsShowCustomerService', true)
    } else {
      store.dispatch('setIsShowCustomerService', false)
    }
    // 检测去的页面是不是工作台 判断客服图标的展示   end
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      //  NProgress.done()
    } else {
      // check login user.roles is null
      if (store?.getters.addRouters.length === 0) {
        try {
          if (!store.state.permission?.platformList || store.state.permission?.platformList.length <= 0) {
            await store.dispatch('GetUserPlatformList')
            await store.dispatch('refreshFrontPlatform')
          }
          // 运营角色获取另外一个接口领取用户数据
          if (store.state.permission.isPlatform !== IS_OPEERATE) {
            await store.dispatch('GetInfo')
          } else if (store.state.permission.isPlatform === IS_OPEERATE) {
            await store.dispatch('GetUserInfo')
          }
          // 生成路由
          await store.dispatch('GenerateRoutes')
          // 动态添加可访问路由表
          router.addRoutes(store?.getters.addRouters)
          // 请求带有 redirect 重定向时，登录自动重定向到该地址
          // const redirect = decodeURIComponent(from.query.redirect || to.path)
          // if (to.path === redirect) {
          // set the replace: true so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          cleanLoginInfo()
          next({ path: loginRoutePath })
        }
      } else {
        next()
      }
    }
  } else {
    if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath })
    }
  }
})

router.afterEach(() => {
  // NProgress.done() // finish progress bar
})
