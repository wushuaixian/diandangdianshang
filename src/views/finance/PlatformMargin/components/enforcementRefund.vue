<template>
  <a-modal title="执行退款" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <p class="text">
      <span>{{ params.merchantName }}</span
      >单位,退还保证金<span>{{ params.feeAmt }}</span
      >元,执行退还生成应付单。
    </p>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    handleCancel() {
      this.$emit('close')
    },
    handleOk() {
      this.$emit('enforcementRefund')
    }
  }
}
</script>
<style lang="less" scoped>
.text {
  text-align: center;
  span {
    color: #ff6b00;
  }
}
</style>
