<template>
  <div class="d-slot-fileds-input-text">
    <a-input :value="value" :maxLength="length" @change="handleChange" :disabled="disabled"></a-input>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    length: {
      type: Number,
      default: 100
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
