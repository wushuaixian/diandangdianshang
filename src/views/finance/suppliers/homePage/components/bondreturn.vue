<template>
  <div class="bondReturn">
    <a-modal title="平台保证金退还" :visible="visible" @cancel="handleCancel" @ok="handleOk">
      <h2>{{ merchantName }}</h2>
      <p style="color: #f59a23">
        平台保证金总额 <span class="color"> {{ balance }} </span>元，您可申请退还金额
        <span class="color"> {{ refundAmt }} </span>元
      </p>
      <p>
        <span class="bondreturnTitle">申请退还金额：</span>
        <a-input
          :disabled="refundAmt === 0"
          class="inp"
          oninput="value=value.replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g,'').replace('.','$#$').replace(/\./g,'').replace('$#$','.').replace(/\.{2,}/g,'.').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
          v-model="feeAmt"
        />
        <span class="bondreturnTitle"> 元</span>
      </p>
      <p class="longText">
        提示：超平台保证金上限部分保证金不能申请退还的情况包括：退还中、寻源项目占用、商家违约申诉占用等，有疑问请致电400-900-7186。
        <!-- 备注:
        <a-textarea
          v-model="remark"
          class="textareaInp"
          placeholder="请输入备注"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        /> -->
      </p>
    </a-modal>
  </div>
</template>
<script>
import { queryBondReturn, addMarginRefund } from '@/api/fince'
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      balance: 0,
      refundAmt: 0,
      merchantName: '',
      feeAmt: '',
      remark: ''
    }
  },
  mounted() {
    queryBondReturn().then((res) => {
      if (res.code === '0') {
        this.balance = res.data.balance
        this.refundAmt = res.data.refundAmt
        this.merchantName = res.data.merchantName
      }
    })
  },
  methods: {
    handleCancel() {
      this.$emit('close')
    },
    handleOk() {
      if (this.feeAmt <= 0) {
        this.$message.info('请输入正确的金额')
      } else {
        addMarginRefund({ type: 15, feeAmt: this.feeAmt, remark: this.remark }).then((res) => {
          if (res.code === '0') {
            this.$message.success('提交成功')
            this.$emit('close')
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.inp {
  width: 200px;
}
.textareaInp {
  width: 500px;
}
.color {
  font-size: 20px;
  color: #ff6b00;
}
.longText {
  color: #b0b0b0;
}
.bondreturnTitle {
  color: black;
  font-weight: 500;
}
</style>
