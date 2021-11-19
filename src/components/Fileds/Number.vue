<template>
  <div class="d-slot-fileds-input-number">
    <a-input-number
      style="width: 100%"
      :value="value"
      :min="min"
      :max="max"
      :precision="floatLength"
      @change="handleNumberChange"
      :disabled="disabled"
    ></a-input-number>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    floatLength: {
      // 小数点后位数
      type: Number,
      default: 2
    },
    min: {
      // 最小值
      type: Number,
      default: 0
    },
    max: {
      // 最大值
      type: Number,
      default: 100000000
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleNumberChange(value) {
      const { floatLength } = this
      const number = value ? Math.abs(value, floatLength) : value
      this.$emit('input', number)
      this.$emit('change', number)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
