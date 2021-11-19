// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
import VueClipboard from 'vue-clipboard2'
import { optionalChaining } from '@/utils/util'

import '@/plugins/'
import './assets/styles/index.less'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './global.less' // global style
import moment from 'moment' // 导入文件
Vue.prototype.moment = moment // 赋值使用
Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
Vue.use(VueClipboard)
// use pro-layout components
Vue.component('ProLayout', ProLayout)
Vue.component('PageContainer', PageHeaderWrapper)
Vue.component('PageHeaderWrapper', PageHeaderWrapper)
Vue.prototype.$$ = optionalChaining
window.umi_plugin_ant_themeVar = themePluginConfig.theme
new Vue({
  router,
  store,
  i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')
