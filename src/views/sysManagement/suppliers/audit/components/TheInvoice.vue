<template>
  <div class="invoice">
    <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 10 }">
      <header-title>
        <span>发票信息</span>
      </header-title>
      <a-form-model-item label="发票抬头" prop="invoiceTitle">
        {{ form.invoiceTitle }}
      </a-form-model-item>
      <a-form-model-item label="税号" prop="dutyParagraph">
        {{ form.dutyParagraph }}
      </a-form-model-item>
      <a-form-model-item label="注册地址" prop="registerAddressCode">
        {{ form.provinceName }} {{ form.cityName }} {{ form.regionName }}
        <!-- <AreaSelect :selected.sync="form.registerAddress" v-model="form.registerAddressCode" /> -->
      </a-form-model-item>
      <a-form-model-item label="详细地址" prop="detailAddress">
        {{ form.detailAddress }}
      </a-form-model-item>
      <a-form-model-item label="开户银行" prop="bankDeposit">
        {{ form.bankDeposit }}
      </a-form-model-item>
      <a-form-model-item label="账号" prop="bankAccount">
        {{ form.bankAccount }}
      </a-form-model-item>
      <a-form-model-item label="电话号码" prop="mobileNo">
        {{ form.mobileNo }}
      </a-form-model-item>
      <header-title>
        <span>收票地址</span>
      </header-title>
      <a-form-model-item label="收票地址" prop="receiveAdressCode">
        {{ form.receiveAdressArea }} {{ form.receiveAdressCity }} {{ form.receiveAdressProvince }}
      </a-form-model-item>
      <a-form-model-item label="详细地址" prop="receiveAdressDetail">
        {{ form.receiveAdressDetail }}
      </a-form-model-item>
      <a-form-model-item label="收票人" prop="receivePersonName">
        {{ form.receivePersonName }}
      </a-form-model-item>
      <a-form-model-item label="联系电话" prop="receivePersonMobile">
        {{ form.receivePersonMobile }}
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { getInvoiceDetail } from '@/api/enterprise'
export default {
  data() {
    return {
      form: {}
    }
  },
  mounted() {
    this.getInvoiceDetail()
  },
  methods: {
    async getInvoiceDetail() {
      const { id: merchantId } = this.$route.params
      const res = await getInvoiceDetail({ merchantId })
      if (res.code === '0') {
        this.form = res.data
      }
    }
  }
}
</script>

<style lang="less" scoped>
.invoice {
  .head-title {
    margin-bottom: 20px;
  }
}
</style>
