<template>
  <div>
    <a-modal v-model="visible" title="" @ok="handleOk">
      <div class="paddMarg">
        <p>
          确定已经收到来自
          <span class="span">{{ merchantName }}</span> 的付款项吗?
        </p>
        <p>实收款：{{ feeAmt | formatCurrency(2, true) }}元</p>
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
        id: ''
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
    handleOk(e) {
      // console.log(e)
      this.visible = false
      this.updateBillStatusById()
      this.addInvoice()
      this.location.reload(true)
    },
    init(data) {
      this.visible = true
      const { billStatus, id, paymentBillCode, merchantName, feeAmt } = data
      this.obj.billStatus = billStatus
      this.obj.id = id
      this.merchantName = merchantName
      this.feeAmt = feeAmt
      this.add.paymentBillCode = paymentBillCode
    },
    async updateBillStatusById() {
      await updateBillStatusById({ ...this.obj })
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
    color: #ff6b00;
  }
  .paddMarg {
    padding-top: 42px;
  }
}
</style>
