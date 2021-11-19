<template>
  <div class="implement">
    <div :is="tables[active]" :loginInfo="loginInfo" :activeParser="active" @changeCount="handleChangeCount">
      <a-tabs type="card" v-model="active" @change="handleChange">
        <a-tab-pane :key="0" :tab="`计划待执行 (${countPendingExecuteObject.pendingExecute || 0})`"> </a-tab-pane>
        <a-tab-pane :key="1" :tab="`计划寻源中 (${countPendingExecuteObject.findSource || 0})`"> </a-tab-pane>
        <a-tab-pane :key="2" :tab="`计划已下单 (${countPendingExecuteObject.orderNumCount || 0})`"></a-tab-pane>
        <a-tab-pane :key="3" :tab="`计划已关闭 (${countPendingExecuteObject.executeClosed || 0})`"></a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { WaitPage, SourcePage, OrderPage } from './compoents/'
import { mapMutations, mapState } from 'vuex'
import { countPendingExecute, getLoginUserInfo } from '@/api/projectCarry'
const countPendingExecuteObject = [
  // 计划待执行
  'pendingExecute',
  // 计划以关闭
  'executeClosed',
  // 计划寻源
  'findSource',
  // 长协待下单
  'longTermOrder',
  // 零采待下单
  'detailOrder',
  // 计划已下单
  'orderNumCount'
]
export default {
  components: { WaitPage, SourcePage, OrderPage },
  data() {
    return {
      active: 0,
      loginInfo: null,
      tables: ['WaitPage', 'SourcePage', 'OrderPage', 'WaitPage']
      // countPendingExecuteObject: {}
    }
  },
  created() {
    this.getLoginUserInfo()
    this.getCountPendingExecute()
  },
  computed: {
    ...mapState({
      countPendingExecuteObject: (state) => state.planManage.countPendingExecuteObject
    })
  },
  methods: {
    ...mapMutations(['setState', 'setCountPendingExecuteObject']),
    async getLoginUserInfo() {
      const res = await getLoginUserInfo()
      if (res.code === '0') {
        this.loginInfo = res.data
      }
    },
    handleChange(val) {
      this.setState({ key: ['planManage', 'implementActive'], value: val })
    },
    async getCountPendingExecute() {
      const { data } = await countPendingExecute()
      // this.countPendingExecuteObject = data
      countPendingExecuteObject.forEach((item) => {
        this.setCountPendingExecuteObject({
          text: item,
          value: data[item]
        })
      })
    },
    handleChangeCount() {
      this.getCountPendingExecute()
    }
  },
  beforeDestroy() {
    this.setState({ key: ['planManage', 'implementActive'], value: 0 })
  }
}
</script>

<style lang="less" scoped>
.implement {
  .ant-tabs-tab {
    background: #f9f9f9;
  }
  /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab-active {
    border-top: 2px solid #ff6b00;
    height: 50px;
    color: #ff6b00;
  }
}
</style>
