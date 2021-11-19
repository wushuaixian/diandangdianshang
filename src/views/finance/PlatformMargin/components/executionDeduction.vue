<template>
  <a-modal title="执行划扣" :visible="visible" @ok="handleOk" @cancel="handleCancel">
    <p class="text">
      确认执行划扣<span class="color">{{ params.merchantName }}</span
      >单位平台保证金<span class="color">{{ params.deductApplyAmount | formatCurrency(2, true) }}</span
      >元?
    </p>
  </a-modal>
</template>
<script>
import { executeDeduct } from '@/api/fince'
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
      const formData = new FormData()
      formData.append('forfeitBillCode', this.params.forfeitBillCode)
      executeDeduct(formData).then((res) => {
        if (res.code === '0') {
          this.$emit('close')
          this.$emit('search')
          this.$message.success('执行划扣成功！')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.text {
  text-align: center;
}
.color {
  color: #ff6b00;
}
</style>
