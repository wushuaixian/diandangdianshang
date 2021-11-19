<!--
 * @Author: your name
 * @Date: 2021-07-08 15:20:06
 * @LastEditTime: 2021-07-08 17:37:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /fte_manage_integrated/src/views/systemManagement/organization/list/components/TheFinance.vue
-->
<template>
  <div class="the-finance">
    <header-title>
      <span>银行信息</span>
    </header-title>
    <FinanceState v-if="queryParams && $$(queryParams, 'auditStatus') !== '0'" :info="queryParams" />
    <div class="finContent">
      <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="选择银行">
          <span>{{ queryParams.bankName }}</span>
        </a-form-item>
        <a-form-item label="开户支行">
          <div class="cityClass">
            <span>{{ queryParams.openBankName }}</span>
          </div>
        </a-form-item>
        <a-form-item label="银行账号">
          <span>{{ queryParams.bankNumber }}</span>
        </a-form-item>
        <a-form-item label="开户名称">
          <span>{{ queryParams.bankAccountName }}</span>
        </a-form-item>
        <a-form-item label="支行联行号">
          <span>{{ queryParams.bankBranchNumer }}</span>
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
            <span>{{ certificateTypeText[queryParams.certificateType] }}</span>
          </a-form-item>
          <a-form-item label="法定代表人身份证">
            <div class="IDcard">
              <ImagePreview :value="queryParams.certificateFrontUrl"></ImagePreview>
            </div>
            <div class="IDcard">
              <ImagePreview :value="queryParams.certificateReverseUrl"></ImagePreview>
            </div>
          </a-form-item>
          <a-form-item label="法定代表人">
            <span>{{ queryParams.legalPersonName }}</span>
          </a-form-item>
          <a-form-item label="证件号码">
            <span>{{ queryParams.certificateNumber }}</span>
          </a-form-item>
          <a-form-item label="证件有效期">
            <span>{{ queryParams.certificateValid }}</span>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="class-btn">
      <!-- <a-button class="save-btn" type="primary" v-if="!edit">保存</a-button> -->
      <a-button @click="$router.back()">返回</a-button>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from '@/components/'
import { queryFInanceInfoByMerchantId } from '@/api/enterprise'
import FinanceState from '@/views/enterprise/compontents/financeState.vue'
export default {
  props: {
    // data: {
    //   type: Object,
    //   default: () => {}
    // },
    edit: {
      type: Boolean,
      default: () => false
    },
    merchantId: {
      type: String,
      default: () => ''
    }
  },
  async created() {
    const { merchantId } = this
    const result = await queryFInanceInfoByMerchantId({ merchantId })
    this.queryParams = result.data
  },
  components: { ImagePreview, FinanceState },
  data() {
    return {
      certificateTypeText: ['', '身份证', '护照', '', '港澳居民往来内地通行证证', '台胞证'],
      queryParams: {}
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
.class-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
  .save-btn {
    margin-right: 20px;
  }
}
</style>
