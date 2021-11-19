<template>
  <a-modal title="去激活" :visible="visible" @cancel="handleCancel">
    <p style="margin-left: 20px; text-align: center">您的叮当账户未激活，请先进行激活操作</p>
    <template slot="footer">
      <a-button key="submit" type="primary" @click="go"> 去激活 </a-button>
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
      this.$emit('close')
      this.$emit('Deactivation')
    },
    handleCancel() {
      this.$emit('close')
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
