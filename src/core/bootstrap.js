import store from '@/store'
import storage from 'store'
import {
  APP_LANGUAGE,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_HIDE_HEADER,
  TOGGLE_LAYOUT,
  TOGGLE_NAV_THEME,
  TOGGLE_WEAK,
  TOGGLE_COLOR,
  TOGGLE_MULTI_TAB
} from '@/store/mutation-types'
import defaultSettings from '@/config/defaultSettings'
import Vue from 'vue'
// import { kebabCase } from 'lodash'

export default function Initializer() {
  store.commit(TOGGLE_LAYOUT, storage.get(TOGGLE_LAYOUT, defaultSettings.layout))
  store.commit(TOGGLE_FIXED_HEADER, storage.get(TOGGLE_FIXED_HEADER, defaultSettings.fixedHeader))
  store.commit(TOGGLE_FIXED_SIDEBAR, storage.get(TOGGLE_FIXED_SIDEBAR, defaultSettings.fixSiderbar))
  store.commit(TOGGLE_CONTENT_WIDTH, storage.get(TOGGLE_CONTENT_WIDTH, defaultSettings.contentWidth))
  store.commit(TOGGLE_HIDE_HEADER, storage.get(TOGGLE_HIDE_HEADER, defaultSettings.autoHideHeader))
  store.commit(TOGGLE_NAV_THEME, storage.get(TOGGLE_NAV_THEME, defaultSettings.navTheme))
  store.commit(TOGGLE_WEAK, storage.get(TOGGLE_WEAK, defaultSettings.colorWeak))
  store.commit(TOGGLE_COLOR, storage.get(TOGGLE_COLOR, defaultSettings.primaryColor))
  store.commit(TOGGLE_MULTI_TAB, storage.get(TOGGLE_MULTI_TAB, defaultSettings.multiTab))
  //  store.commit('SET_TOKEN', storage.get(ACCESS_TOKEN))

  store.dispatch('setLang', storage.get(APP_LANGUAGE, 'zh-CN'))

  const files = require.context('../components/_global/', true, /\.(js|vue)$/)

  files.keys().forEach(file => {
    const config = files(file)
    // console.log(file.replace(/^\.\//, ''), config)
    Vue.component(config.default.name, config.default || config)
  })
}
