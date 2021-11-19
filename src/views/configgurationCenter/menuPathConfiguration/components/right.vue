<!--
 * @Author: your name
 * @Date: 2021-07-26 17:12:17
 * @LastEditTime: 2021-08-03 11:39:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/menuPathConfiguration/components/right.vue
-->
<template>
  <div>
    <addMenuPath :info="info" @ok="ok"></addMenuPath>
    <br />
    <updateMenuPath :info="info" @ok="ok"></updateMenuPath>
  </div>
</template>
<script>
import addMenuPath from './addMenuPath'
import updateMenuPath from './updateMenuPath'
export default {
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    addMenuPath,
    updateMenuPath
  },
  methods: {
    ok() {
      this.$emit('ok')
    }
  }
}
</script>
<style scoped lang="less">
</style>
