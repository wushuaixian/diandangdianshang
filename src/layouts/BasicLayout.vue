<template>
  <div :class="{ screenfull: isScreenfull }">
    <pro-layout
      :footer="null"
      :collapsed="collapsed"
      :mediaQuery="query"
      :isMobile="isMobile"
      :handleMediaQuery="handleMediaQuery"
      :handleCollapse="handleCollapse"
      :i18nRender="i18nRender"
      v-bind="settings"
      :collapsedButtonRender="false"
    >
      <!-- Ads begin
      广告代码 真实项目中请移除
      production remove this Ads
    -->
      <!-- <ads v-if="isProPreviewSite && !collapsed" /> -->
      <!-- Ads end -->

      <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
      <template v-slot:menuHeaderRender>
        <div @click="goLink">
          <img src="/logoTitle.png" alt="" />
          <h1>{{ title }}</h1>
        </div>
      </template>
      <template v-slot:menuRender>
        <global-menu :menus="menus" />
      </template>
      <!-- <template v-slot:menuItemRender="props">
      <div>aa</div>
    </template> -->

      <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
      <!-- <template v-slot:headerContentRender>
        <div>
          <a-tooltip title="刷新页面">
            <a-icon type="reload" style="font-size: 18px; cursor: pointer" @click="handleScreenfull" />
          </a-tooltip>
        </div>
      </template> -->

      <!-- <setting-drawer v-if="isDev" :settings="settings" @change="handleSettingChange">
      <div style="margin: 12px 0">This is SettingDrawer custom footer content.</div>
    </setting-drawer> -->
      <template v-slot:rightContentRender>
        <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
      </template>
      <!-- custom footer / 自定义Footer -->
      <!-- <template v-slot:footerRender>
      <global-footer />
    </template> -->
      <div v-show="isIframe" class="pg-iframe">
        <iframe ref="iframe" :src="iframeUrl" frameborder="0" />
      </div>
      <router-view />
    </pro-layout>
  </div>
</template>

<script>
import { SettingDrawer } from '@ant-design-vue/pro-layout'
import { i18nRender } from '@/locales'
import { mapState, mapActions, mapMutations } from 'vuex'
import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'
import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalMenu from '@/components/GlobalMenu/'
import Ads from '@/components/Other/CarbonAds'
import LogoSvg from '../assets/logo.svg?inline'
import screenfull from 'screenfull'

// import { genterMenu } from './_utils'
// import { bxAnaalyse } from '@/core/icons'
export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalMenu,
    LogoSvg,
    Ads
  },

  data() {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end
      isDev: process.env.NODE_ENV === 'development' || process.env.VUE_APP_PREVIEW === 'true',

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false,
      actions: () =>
        new Map([
          [
            'logout',
            async () => {
              await this.Logout()
              this.$router.push({
                path: '/user/login'
              })
            }
          ],
          [
            'screenfull',
            ({ value }) => {
              if (Number(value) === 1) {
                if (!screenfull.isEnabled) {
                  // 如果不允许进入全屏，发出不允许提示
                  this.$message.warning('不支持全屏')
                  return false
                }
                screenfull.toggle()
              }
            }
          ]
        ])
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: (state) => state.permission.addRouters,
      yzbRouters: (state) => state.permission.yzbRouters,
      menuList: (state) => state.permission.menuList,
      isScreenfull: (state) => state.app.isScreenfull
    }),
    isIframe() {
      const { path } = this.$route
      return /iframe/.test(path)
    },
    iframeUrl() {
      const {
        query: { url }
      } = this.$route
      return decodeURIComponent(url)
    }
  },

  created() {
    const { menuList } = this
    this.menus = menuList || []

    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
    this.init()
  },
  mounted() {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }
    // iframe通信
    window.addEventListener(
      'message',
      ({ data }) => {
        // eslint-disable-next-line no-unused-expressions
        if (data?.action) {
          const [, method] = [...this.actions()].find(([key, value]) => key === data?.action)
          method instanceof Function && method(data)
        }
      },
      false
    )
    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    // if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
    //   updateTheme(this.settings.primaryColor)
    // }
  },
  beforeDestroy() {
    window.removeEventListener('message', this.message)
    this.destroy()
  },
  methods: {
    i18nRender,
    ...mapActions(['Logout']),
    ...mapMutations(['setState']),
    handleScreenfull() {
      if (!screenfull.isEnabled) {
        // 如果不允许进入全屏，发出不允许提示
        this.$message.warning('不支持全屏')
        return false
      }
      screenfull.toggle()
    },
    // 全屏
    changeFullscreen() {
      if (!screenfull.isFullscreen) {
        // eslint-disable-next-line no-unused-expressions
        this.$refs?.iframe.contentWindow.postMessage(
          {
            action: 'screenfull', // 全屏
            value: '0' // '1' 全屏 '0' 正常
          },
          '*'
        )
      }
      this.setState({ key: ['app', 'isScreenfull'], value: screenfull.isFullscreen })
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.changeFullscreen)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.changeFullscreen)
      }
    },
    handleMediaQuery(val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
        // this.settings.fixSiderbar = false
      }
    },
    handleCollapse(val) {
      this.collapsed = val
    },
    handleSettingChange({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    },
    goLink() {
      // window.open('http://yzb.uat.dingdangmro.com/member/login/executeLogin.htm')
      // window.location.href = 'http://www.uat.dingdangmro.com/#/home'
      window.location.href = process.env.VUE_APP_HOME_URL
    }
  }
}
</script>

<style lang="less">
@import './BasicLayout.less';
.pg-iframe {
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}
</style>
