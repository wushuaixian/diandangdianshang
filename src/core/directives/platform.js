import Vue from 'vue'
import store from '@/store'

/**
 * platform 权限指令
 * 指令用法：
 *  - 在需要控制 platform 级别权限的组件上使用 v-platform:[method] , 如下：
 *    <i-button v-platform:IS_SUPPLIERS >是否运营</a-button>
 *
 */
const action = Vue.directive('platform', {
  inserted: function(el, binding, vnode) {
    const platform = binding.arg
    const platformList = store?.state?.permission?.platformList
    if (!platformList?.includes(platform)) {
      ;(el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none')
    }
  }
})

export default action
