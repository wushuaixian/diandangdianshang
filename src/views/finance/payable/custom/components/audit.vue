<template>
  <div>
    <a-modal v-model="visible" height="400px" title="作废" @ok="handleOk">
      <div class="content">
        <p>作废应付单导致应付单关闭,并无法重新开启</p>
        <p>确定作废?</p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { updataBillStatus } from '@/api/custom'
export default {
  data() {
    return {
      visible: false,
      obj: {
        id: '',
        billStatus: 9
      }
    }
  },
  methods: {
    async updataBillStatus() {
      await updataBillStatus({ ...this.obj })
      this.$emit('getList')
    },
    init(data) {
      this.visible = true
      this.obj.id = data.id
      console.log(data)
    },
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
      this.updataBillStatus()
      // location.reload(true)
    }
  }
}
</script>
<style lang='less' scoped>
div {
  .content {
    text-align: center;
  }
  & > p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #262626;
    letter-spacing: 0;
    line-height: 18px;
  }

  .ant-modal-footer {
    border-top: 1px solid #fff !important;
  }
}
</style>
