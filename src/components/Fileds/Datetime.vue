<template>
  <div class="d-slot-fileds-input-number">
    <a-date-picker
      style="width: 100%"
      :value="value"
      @change="(date, datestr) => handleChangeDate(datestr)"
      :disabled-date="disabledDate"
      :disabled="disabled"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object],
      default: () => {}
    },
    disabledDate: {
      type: Function,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleChangeDate(value) {
      this.$emit('input', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
