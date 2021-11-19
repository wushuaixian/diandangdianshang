<template>
  <div class="the-finance">
    <header-title>
      <span>银行信息</span>
    </header-title>
    <FinanceState v-if="data && $$(data, 'auditStatus') !== '0'" :info="data" />
    <div class="finContent">
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="选择银行">
          <span>{{ data.bankName }}</span>
        </a-form-item>
        <a-form-item label="开户支行">
          <div class="cityClass">
            <span>{{ data.openBankName }}</span>
          </div>
        </a-form-item>
        <a-form-item label="银行账号">
          <span>{{ data.bankNumber }}</span>
        </a-form-item>
        <a-form-item label="开户名称">
          <span>{{ data.bankAccountName }}</span>
        </a-form-item>
        <a-form-item label="支行联行号">
          <span>{{ data.bankBranchNumer }}</span>
        </a-form-item>
      </a-form>
    </div>
    <header-title>
      <span>法人信息</span>
    </header-title>
    <div>
      <div class="finContent">
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
          <a-form-item label="证件类型">
            <span>{{ certificateTypeText[data.certificateType] }}</span>
          </a-form-item>
          <a-form-item label="法定代表人身份证">
            <div class="IDcard">
              <ImagePreview :value="data.certificateFrontUrl"></ImagePreview>
            </div>
            <div class="IDcard">
              <ImagePreview :value="data.certificateReverseUrl"></ImagePreview>
            </div>
          </a-form-item>
          <a-form-item label="法定代表人">
            <span>{{ data.legalPersonName }}</span>
          </a-form-item>
          <a-form-item label="证件号码">
            <span>{{ data.certificateNumber }}</span>
          </a-form-item>
          <a-form-item label="证件有效期">
            <span>{{ data.certificateValid }}</span>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from '@/components/'
import FinanceState from '@/views/enterprise/compontents/financeState.vue'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: { ImagePreview, FinanceState },
  data() {
    return {
      certificateTypeText: ['', '身份证', '护照', '', '港澳居民往来内地通行证证', '台胞证']
    }
  }
}
</script>

<style lang="less" scoped>
.the-finance {
  .ant-form {
    margin-top: 20px;
  }
  .finContent {
    .IDcard + .IDcard {
      margin-top: 20px;
    }
  }
}
</style>
