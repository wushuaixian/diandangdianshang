/*
 * @Author: your name
 * @Date: 2021-07-26 17:08:44
 * @LastEditTime: 2021-07-26 17:08:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/configgurationCenter/menuPathConfiguration/index.js
 */
<template>
  <div class="box">
    <a-card class="display">
      <left ref="left" class="left" @changeInfo="changeInfo"></left>
      <right class="right" :info="info" @ok="ok"></right>
    </a-card>
  </div>
</template>
<script>
import left from './components/left'
import right from './components/right'
export default {
  components: {
    left,
    right
  },
  data() {
    return {
      info: {}
    }
  },
  methods: {
    changeInfo(info) {
      this.info = info
    },
    ok() {
      this.$refs.left.getTreeList()
    }
  }
}
</script>
<style scoped lang="less">
.box {
  width: 100%;
}
/deep/ .ant-card-body {
  width: 100%;
  display: flex;
  min-height: 600px;
  .left {
    width: 30%;
    padding-right: 20px;
    border-right: 1px solid #f5f5f5;
  }
  .right {
    width: 65%;
    padding-left: 40px;
  }
}
</style>
