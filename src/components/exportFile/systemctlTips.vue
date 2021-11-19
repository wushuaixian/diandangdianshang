<template>
  <div>
    <a-modal title="系统提示" :visible="visible" :footer="null" @cancel="handleCancel">
      <p>导出任务成功，任务编码: {{ code }}</p>
      <div class="footer">
        <a-button @click="$emit('close')">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    code: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less" scoped>
.footer {
  width: 100%;
  text-align: right;
}
</style>
