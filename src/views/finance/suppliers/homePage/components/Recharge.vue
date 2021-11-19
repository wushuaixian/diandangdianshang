<template>
  <div class="recharge">
    <a-modal
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      title="充值"
      :visible.sync="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form-model layout="inline" :model="params">
        <a-form-model-item label="充值金额(元)">
          <a-input
            v-model="params.rechargeApplyAmount"
            class="int"
            oninput="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>
<script>
import { rechargeAmount } from '@/api/fince'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      params: {},
      confirmLoading: false
    }
  },
  methods: {
    async handleOk() {
      const { params } = this
      console.log(params.rechargeApplyAmount)
      if (params.rechargeApplyAmount > 0) {
        const res = await rechargeAmount(params.rechargeApplyAmount)
        if (res?.code === '0') {
          const { rechargeCode: code } = res?.data

          this.$router.push({
            name: 'FinancePaymentCashier',
            params: {
              orderCode: code,
              id: 8,
              paymentBalance: res.data.rechargeApplyAmount,
              payerType: 1,
              paymentBillCode: '1',
              mergePaymentType: 0
            }
          })
        }
      } else {
        this.$message.info('请输入正确的充值金额')
      }
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.int {
  width: 300px;
}
</style>
