<template>
  <a-modal title="重新发起" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <p>是否重新发起此应付单?</p>
  </a-modal>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  methods: {
    handleOk() {
      this.$emit('okRelaunch')
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
