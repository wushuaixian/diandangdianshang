<template>
  <a-modal title="去完善" :visible="visible" @cancel="handleCancel">
    <p style="margin-left: 20px; text-align: center">您的银行账户未完善，请先完善银行信息！</p>
    <template slot="footer">
      <a-button key="submit" type="primary" @click="go"> 去完善 </a-button>
    </template>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {}
  },
  methods: {
    go() {
      this.$router.push({
        name: 'Enterprise'
      })
    },
    handleCancel() {
      this.$parent.goBankCardVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.go {
  color: #ff6b00;
  cursor: pointer;
}
.close {
  width: 100%;
  text-align: right;
}
</style>
