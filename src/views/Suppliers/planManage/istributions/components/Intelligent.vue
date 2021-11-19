<template>
  <div>
    <div>
      <a-modal v-model="visibles" title="智能分配" width="600px" ok-text="确认" cancel-text="取消" @ok="hideModals">
        <div>
          <p>正在分配，请稍后......</p>
          <a-progress type="circle" :percent="21" :width="80" />
        </div>
      </a-modal>
    </div>
  </div>
</template>

// <script>
// import { buyerInfo } from '@/api/buyerPlanItem'
export default {
  data() {
    return {
      column,
      visible: false,
      visibles: false
    }
  },
  mounted() {},
  methods: {
    // 隐藏手动分配计划弹框
    hideModals() {
      this.visibles = false
    },
    // 显示一键分配
    init() {
      this.visibles = true
    }
  }
}
</script>
<style lang="less" scoped>
.SearchName {
  text-align: center;
  display: flex;
  align-items: center;
  span {
    margin-left: 60px;
  }
  .nameSearchIpt {
    width: 300px;
  }
}
</style>
