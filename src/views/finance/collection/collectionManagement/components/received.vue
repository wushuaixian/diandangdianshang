<template>
  <div>
    <a-modal v-model="visible" title @ok="handleOk">
      <div class="paddMarg">
        <p>
          确定已经收到来自
          <span class="span">{{ merchantName }}</span> 的付款项吗?
        </p>
        <p>实收款：{{ feeAmt }}元</p>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { updateBillStatusById, addInvoice } from '@/api/receipt'
export default {
  name: 'Received',
  data() {
    return {
      visible: false,
      merchantName: '',
      feeAmt: '',
      obj: {
        billStatus: '',
        id: '',
        paymentMethod: ''
      },
      add: {
        paymentBillCode: ''
      }
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    async handleOk(e) {
      this.visible = false
      const res = await updateBillStatusById({ ...this.obj })
      if (res.code === '0') {
        await this.addInvoice()
        this.$emit('ok')
      }
    },
    init(data) {
      this.visible = true
      const { billStatus, id, paymentBillCode, merchantName, feeAmt, paymentMethod } = data
      this.obj.billStatus = billStatus
      console.log(billStatus)
      this.obj.id = id
      this.obj.paymentMethod = paymentMethod
      this.merchantName = merchantName
      this.feeAmt = feeAmt
      this.add.paymentBillCode = paymentBillCode
    },
    async addInvoice() {
      await addInvoice({ ...this.add })
    }
  }
}
</script>
<style lang="less" scoped>
div {
  text-align: center;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #262626;
  line-height: 18px;
  .span {
    color: #262626;
  }
  .paddMarg {
    padding-top: 42px;
  }
}
</style>
